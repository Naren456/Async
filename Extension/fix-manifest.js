// Fix manifest.json after build to use plain background.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const manifestPath = path.join(__dirname, 'dist', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Copy background.js to dist
fs.copyFileSync(
  path.join(__dirname, 'background.js'),
  path.join(__dirname, 'dist', 'background.js')
);

// Fix manifest to use plain background.js
if (manifest.background) {
  manifest.background = {
    service_worker: 'background.js'
    // Removed type: "module" to fix importScripts error
  };
}

// Fix action to include popup
if (manifest.action) {
  manifest.action.default_popup = 'popup.html';
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Fixed manifest.json - background worker and popup ready');
