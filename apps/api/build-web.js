const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Building DP Skilltech Web Platform ===');

const webDir = path.resolve(__dirname, '../web');
const apiDistDir = path.resolve(__dirname, 'dist');
const webDistDir = path.resolve(webDir, 'dist');

try {
  // 1. Build the frontend web application
  console.log('Building web client in:', webDir);
  execSync('npm run build', { cwd: webDir, stdio: 'inherit' });

  // 2. Clear & create api/dist
  if (fs.existsSync(apiDistDir)) {
    fs.rmSync(apiDistDir, { recursive: true, force: true });
  }
  fs.mkdirSync(apiDistDir, { recursive: true });

  // 3. Copy all web/dist files to api/dist so Vercel finds index.html in dist
  console.log('Copying frontend distribution to', apiDistDir);
  fs.cpSync(webDistDir, apiDistDir, { recursive: true });

  console.log('=== DP Skilltech Web Platform Build Complete ===');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
