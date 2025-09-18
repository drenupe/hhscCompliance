// Ensures dist/api/package.json has runtime deps needed by the built server.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const distPkgPath = path.join(ROOT, 'dist', 'api', 'package.json');
const rootPkgPath = path.join(ROOT, 'package.json');

const REQUIRED_DEPS = [
  '@nestjs/jwt',
  '@nestjs/passport',
  'passport',
  'passport-jwt',
  'jsonwebtoken',
];

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
}
function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

const rootPkg = readJson(rootPkgPath) || {};
const distPkg = readJson(distPkgPath) || { name: 'api', version: '0.0.0' };
distPkg.type = distPkg.type || 'commonjs';

distPkg.dependencies = distPkg.dependencies || {};
const rootDeps = { ...(rootPkg.dependencies || {}), ...(rootPkg.peerDependencies || {}) };

for (const dep of REQUIRED_DEPS) {
  const v = rootDeps[dep];
  if (!v) {
    console.warn(`[patch-dist-package] WARNING: "${dep}" not in root dependencies. Add it if needed.`);
    continue;
  }
  distPkg.dependencies[dep] = v;
}

writeJson(distPkgPath, distPkg);
console.log('[patch-dist-package] Updated', distPkgPath);
