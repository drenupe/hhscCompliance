import { promises as fs } from 'fs';
import * as path from 'path';

type Json = Record<string, any>;

/** Always returns a string (fallback is required) */
function getArg(name: string, fallback: string): string {
  const flag = process.argv.find((a) => a.startsWith(`--${name}=`));
  return flag ? flag.split('=')[1] : fallback;
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
  const projectJson: Json = JSON.parse(content);

  // Ensure structure exists
  projectJson.targets ??= {};
  projectJson.targets.build ??= {};
  projectJson.targets.build.configurations ??= {};
  projectJson.targets.serve ??= {};
  projectJson.targets.serve.configurations ??= {};

  const normalizeForJson = (p: string) => p.split(path.sep).join('/');

  function applyFileReplacements(
    configName: 'production' | 'staging',
    withPath: string
  ): void {
    const cfg: Json = projectJson.targets.build.configurations[configName] ?? {};
    cfg.fileReplacements = [
      {
        replace: normalizeForJson(path.join(envDir, 'environment.ts')),
        with: normalizeForJson(withPath),
      },
    ];
    projectJson.targets.build.configurations[configName] = cfg;
  }

  // Apply production & staging env replacements
  applyFileReplacements('production', envFiles.prod);
  applyFileReplacements('staging', envFiles.staging);

  // Serve:staging → build:staging
  projectJson.targets.serve.configurations.staging = {
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
