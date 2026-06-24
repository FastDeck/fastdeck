const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '..');

const excludeDirs = ['.git', 'node_modules', 'build', 'dist', '.tauri', '.vscode'];
const excludeFiles = ['yarn.lock', 'Cargo.lock', '.DS_Store'];

// File extensions to process
const includeExts = [
  '.json', '.js', '.ts', '.tsx', '.jsx', '.html', '.md', '.css', '.scss',
  '.rs', '.toml', '.xml', '.kt', '.java', '.kts', '.xcscheme', '.pbxproj', '.yml', '.yaml', '.sh', '', 'makefile'
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (excludeDirs.includes(file)) continue;
      processDirectory(fullPath);
    } else {
      if (excludeFiles.includes(file)) continue;
      
      const ext = path.extname(file);
      const isMakefile = file.toLowerCase() === 'makefile';
      const isBinary = file.endsWith('.png') || file.endsWith('.icns') || file.endsWith('.ico');
      
      if (isBinary) continue;
      
      if (includeExts.includes(ext) || isMakefile || ext === '') {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          // skip binary files disguised as no-extension
          if (content.includes('\u0000')) continue;

          let newContent = content;
          let changed = false;

          if (newContent.includes('fastdeck')) {
            newContent = newContent.replace(/fastdeck/g, 'fastdeck');
            changed = true;
          }
          if (newContent.includes('FastDeck')) {
            newContent = newContent.replace(/FastDeck/g, 'FastDeck');
            changed = true;
          }
          if (newContent.includes('Fastdeck')) {
            newContent = newContent.replace(/Fastdeck/g, 'Fastdeck');
            changed = true;
          }

          if (changed) {
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Updated: ${fullPath}`);
          }
        } catch (e) {
          console.error(`Error reading ${fullPath}: ${e.message}`);
        }
      }
    }
  }
}

console.log(`Starting rename script in ${targetDir}...`);
processDirectory(targetDir);
console.log('Done!');
