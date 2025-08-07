import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ENV_DIR = 'frontend/src/environments';
const FRONTEND_DIR = 'frontend';
const OUTPUT_PATH = 'dist/frontend';

const projectJson = {
  name: 'frontend',
  $schema: './node_modules/nx/schemas/project-schema.json',
  projectType: 'application',
  prefix: 'app',
  sourceRoot: `${FRONTEND_DIR}/src`,
  tags: [],
  targets: {
    build: {
      executor: '@angular-devkit/build-angular:browser',
      outputs: ['{options.outputPath}'],
      options: {
        outputPath: OUTPUT_PATH,
        index: `${FRONTEND_DIR}/src/index.html`,
        main: `${FRONTEND_DIR}/src/main.ts`,
        polyfills: ['zone.js'],
        tsConfig: `${FRONTEND_DIR}/tsconfig.app.json`,
        inlineStyleLanguage: 'scss',
        assets: [
          {
            glob: '**/*',
            input: `${FRONTEND_DIR}/public`
          }
        ],
        styles: [`${FRONTEND_DIR}/src/styles.scss`]
      },
      configurations: {
        production: {
          outputHashing: 'all',
          fileReplacements: [
            {
              replace: `${ENV_DIR}/environment.ts`,
              with: `${ENV_DIR}/environment.prod.ts`
            }
          ],
          budgets: [
            {
              type: 'initial',
              maximumWarning: '500kb',
              maximumError: '1mb'
            },
            {
              type: 'anyComponentStyle',
              maximumWarning: '4kb',
              maximumError: '8kb'
            }
          ]
        },
        development: {
          buildOptimizer: false,
          optimization: false,
          vendorChunk: true,
          extractLicenses: false,
          sourceMap: true,
          namedChunks: true
        },
        staging: {
          fileReplacements: [
            {
              replace: `${ENV_DIR}/environment.ts`,
              with: `${ENV_DIR}/environment.staging.ts`
            }
          ]
        }
      },
      defaultConfiguration: 'production'
    },
    serve: {
      continuous: true,
      executor: '@angular-devkit/build-angular:dev-server',
      configurations: {
        production: {
          buildTarget: 'frontend:build:production'
        },
        development: {
          buildTarget: 'frontend:build:development'
        },
        staging: {
          buildTarget: 'frontend:build:staging'
        }
      },
      defaultConfiguration: 'development'
    },
    'extract-i18n': {
      executor: '@angular-devkit/build-angular:extract-i18n',
      options: {
        buildTarget: 'frontend:build'
      }
    },
    lint: {
      executor: '@nx/eslint:lint'
    },
    test: {
      executor: '@nx/jest:jest',
      outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
      options: {
        jestConfig: `${FRONTEND_DIR}/jest.config.ts`
      }
    },
    'serve-static': {
      continuous: true,
      executor: '@nx/web:file-server',
      options: {
        buildTarget: 'frontend:build',
        port: 4200,
        spa: true
      }
    }
  }
};

const outputPath = join(__dirname, '..', FRONTEND_DIR, 'project.json');
mkdirSync(join(__dirname, '..', FRONTEND_DIR), { recursive: true });
writeFileSync(outputPath, JSON.stringify(projectJson, null, 2));
console.log(`✅ Generated ${outputPath}`);
