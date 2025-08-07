const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = 'frontend';
const PROJECT_JSON_PATH = path.join(FRONTEND_DIR, 'project.json');
const ENV_DIR = 'frontend/src/environments';

const projectJson = JSON.parse(fs.readFileSync(PROJECT_JSON_PATH, 'utf-8'));

const envReplacements = {
  production: `${ENV_DIR}/environment.prod.ts`,
  staging: `${ENV_DIR}/environment.staging.ts`
};

function applyFileReplacements(configName, envPath) {
  const config = projectJson.targets.build.configurations[configName] || {};
  config.fileReplacements = [
    {
      replace: `${ENV_DIR}/environment.ts`,
      with: envPath
    }
  ];
  projectJson.targets.build.configurations[configName] = config;
}

applyFileReplacements('production', envReplacements.production);
applyFileReplacements('staging', envReplacements.staging);

projectJson.targets.serve.configurations.staging = {
  buildTarget: 'frontend:build:staging'
};

fs.writeFileSync(PROJECT_JSON_PATH, JSON.stringify(projectJson, null, 2));
console.log(`✅ Patched ${PROJECT_JSON_PATH}`);
