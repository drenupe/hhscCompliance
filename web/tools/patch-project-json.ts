import { promises as fs } from 'fs';
import * as path from 'path';

type JsonObject = Record<string, unknown>;

type FileReplacement = { replace: string; with: string };

type BuildConfig = JsonObject & {
  fileReplacements?: FileReplacement[];
  buildTarget?: string;
};

type NxTarget = JsonObject & {
  configurations?: Record<string, BuildConfig>;
};

type ProjectJson = JsonObject & {
  targets?: Record<string, NxTarget>;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Always returns a string (fallback is required) */
function getArg(name: string, fallback: string): string {
  const flag = process.argv.find((a) => a.startsWith(`--${name}=`));
  return flag ? flag.split('=')[1] : fallback;
}

function normalizeForJson(p: string): string {
  return p.split(path.sep).join('/');
}

function ensureTarget(projectJson: ProjectJson, name: string): NxTarget {
  projectJson.targets ??= {};
  const existing = projectJson.targets[name];
  if (existing && isObject(existing)) return existing as NxTarget;

  const created: NxTarget = {};
  projectJson.targets[name] = created;
  return created;
}

function ensureConfigurations(target: NxTarget): Record<string, BuildConfig> {
  target.configurations ??= {};
  return target.configurations;
}

async function main(): Promise<void> {
  const project = getArg('project', 'web'); // e.g. "web" or "frontend"
  const appRoot = project;
  const projectJsonPath = path.join(appRoot, 'project.json');
  const envDir = path.join(appRoot, 'src', 'environments');

  const envFiles: Record<'base' | 'prod' | 'staging', string> = {
    base: path.join(envDir, 'environment.ts'),
    prod: path.join(envDir, 'environment.prod.ts'),
    staging: path.join(envDir, 'environment.staging.ts'),
  };

  const content = await fs.readFile(projectJsonPath, 'utf-8');
  const parsed: unknown = JSON.parse(content);

  // Safe-ish cast after runtime check
  const projectJson: ProjectJson = isObject(parsed) ? (parsed as ProjectJson) : {};

  // Ensure structure exists (typed)
  const build = ensureTarget(projectJson, 'build');
  const serve = ensureTarget(projectJson, 'serve');
  const buildConfigs = ensureConfigurations(build);
  const serveConfigs = ensureConfigurations(serve);

  function applyFileReplacements(configName: 'production' | 'staging', withPath: string): void {
    const cfg: BuildConfig = buildConfigs[configName] ?? {};

    cfg.fileReplacements = [
      {
        replace: normalizeForJson(path.join(envDir, 'environment.ts')),
        with: normalizeForJson(withPath),
      },
    ];

    buildConfigs[configName] = cfg;
  }

  // Apply production & staging env replacements
  applyFileReplacements('production', envFiles.prod);
  applyFileReplacements('staging', envFiles.staging);

  // Serve:staging → build:staging (merge-safe)
  serveConfigs.staging = {
    ...(serveConfigs.staging ?? {}),
    buildTarget: `${project}:build:staging`,
  };

  await fs.writeFile(projectJsonPath, JSON.stringify(projectJson, null, 2));
  console.log(`✅ Patched ${normalizeForJson(projectJsonPath)} for project "${project}"`);

  await suggestMissingFiles(envFiles);
}

async function suggestMissingFiles(env: Record<string, string>): Promise<void> {
  for (const [key, p] of Object.entries(env)) {
    try {
      await fs.access(p);
    } catch {
      console.warn(`⚠️  Missing ${key} env file: ${p}`);
    }
  }
}

main().catch((err) => {
  console.error('❌ Failed to patch project.json:', err);
  process.exit(1);
});
