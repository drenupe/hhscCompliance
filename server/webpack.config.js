const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  // Force build output to workspace-root: /dist/api
  output: {
    path: join(__dirname, '../dist/api'),
    filename: 'main.js',
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],

      // Keep your current behavior. (If you want prod minification later, set true.)
      optimization: false,

      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
