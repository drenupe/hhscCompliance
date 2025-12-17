import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

type JsonObject = Record<string, unknown>;

type BuildConfig = JsonObject & {
  fileReplacements?: Array<{ replace: string; with: string }>;
};

type NxTarget = {
  configurations?: Record<string, BuildConfig>;
  [key: string]: unknown;
};

type ProjectJson = JsonObject & {
  targets?: {
    build?: NxTarget & { configurations?: Record<string, BuildConfig> };
    serve?: NxTarget & { configurations?: Record<string, BuildConfig> };
    [name: string]: NxTarget | unknown;
  };
};

const FRONTEND_DIR = 'frontend';
const PROJECT_JSON_PATH = path.join(FRONTEND_DIR, 'project.json');
const ENV_DIR = 'frontend/src/environments';

const raw = JSON.parse(readFileSync(PROJECT_JSON_PATH, 'utf-8')) as unknown;
const projectJson: ProjectJson = (typeof raw === 'object' && raw !== null ? (raw as ProjectJson) : {});

// Strongly-typed env replacements
const envReplacements: Record<'production' | 'staging', string> = {
  production: `${ENV_DIR}/environment.prod.ts`,
  staging: `${ENV_DIR}/environment.staging.ts`,
};

// Ensure nested objects exist so we don’t throw
projectJson.targets ??= {};
projectJson.targets.build ??= {};
projectJson.targets.build.configurations ??= {};
projectJson.targets.serve ??= {};
projectJson.targets.serve.configurations ??= {};

// Normalize paths for JSON (Windows-safe)
const norm = (p: string) => p.split(path.sep).join('/');

function applyFileReplacements(configName: 'production' | 'staging', envPath: string): void {
  const configs = projectJson.targets?.build?.configurations;
  if (!configs) return;

  const cfg: BuildConfig = configs[configName] ?? {};
  cfg.fileReplacements = [
    {
      replace: norm(`${ENV_DIR}/environment.ts`),
      with: norm(envPath),
    },
  ];
  configs[configName] = cfg;
}

applyFileReplacements('production', envReplacements.production);
applyFileReplacements('staging', envReplacements.staging);

// Add serve:staging -> build:staging
projectJson.targets.serve.configurations.staging = {
  ...(projectJson.targets.serve.configurations.staging ?? {}),
  buildTarget: 'frontend:build:staging',
};

writeFileSync(PROJECT_JSON_PATH, JSON.stringify(projectJson, null, 2));
console.log(`✅ Patched ${PROJECT_JSON_PATH}`);
