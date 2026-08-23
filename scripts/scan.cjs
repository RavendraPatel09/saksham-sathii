const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
        getFiles(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

console.log('🔍 Running Cross-Platform Code & Env Audit...\n');

// 1. Scan for potentially unused environment variables
console.log('🔐 [1/2] Comparing environment variables...');
const rootFiles = getFiles(path.join(__dirname, '..', 'src'));
const envExamplePath = path.join(__dirname, '..', '.env.example');
let definedVars = [];
if (fs.existsSync(envExamplePath)) {
  const content = fs.readFileSync(envExamplePath, 'utf8');
  definedVars = content.split('\n')
    .filter(line => line.includes('=') && !line.trim().startsWith('#'))
    .map(line => line.split('=')[0].trim());
}

let usedVars = new Set();
for (const file of rootFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/(?:process\.env|import\.meta\.env)\.([A-Z_0-9]+)/g);
  if (matches) {
    matches.forEach(m => {
      const parts = m.split('.');
      usedVars.add(parts[parts.length - 1]);
    });
  }
}

console.log('\nEnv variables declared but not referenced in code:');
let unusedCount = 0;
definedVars.forEach(v => {
  if (!usedVars.has(v)) {
    console.log(`  ⚠️  Unused environment variable: ${v}`);
    unusedCount++;
  }
});
if (unusedCount === 0) {
  console.log('  ✅ All environment variables declared in .env.example are in use!');
}

// 2. Scan for potentially unused component files
console.log('\n📄 [2/2] Scanning for unused components...');
const componentFiles = getFiles(path.join(__dirname, '..', 'src', 'components'));
const allSrcFiles = getFiles(path.join(__dirname, '..', 'src'));

let unusedComponents = 0;
for (const comp of componentFiles) {
  const compBase = path.basename(comp, path.extname(comp));
  // Skip index files
  if (compBase.toLowerCase() === 'index') continue;

  let isImported = false;
  for (const src of allSrcFiles) {
    if (src === comp) continue;
    const content = fs.readFileSync(src, 'utf8');
    if (content.includes(compBase)) {
      isImported = true;
      break;
    }
  }

  if (!isImported) {
    console.log(`  ⚠️  Component seems unused: ${path.relative(path.join(__dirname, '..'), comp)}`);
    unusedComponents++;
  }
}

if (unusedComponents === 0) {
  console.log('  ✅ No unused component files detected!');
}

console.log('\nAudit complete.');
