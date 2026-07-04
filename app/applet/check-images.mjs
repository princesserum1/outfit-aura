import fs from 'fs';
import path from 'path';

const lawnsDir = path.resolve('public/images/lawns');
const dataFile = path.resolve('src/data.ts');

async function runDiagnostics() {
  console.log("=== Image Diagnostics ===\n");

  // 1. Read files in public/images/lawns
  let filesInDir = [];
  try {
    filesInDir = fs.readdirSync(lawnsDir);
    console.log(`Found ${filesInDir.length} files in public/images/lawns/:`);
    filesInDir.forEach(f => console.log(` - ${f}`));
  } catch (err) {
    console.error(`Error reading directory: ${err.message}`);
  }

  console.log("\n---------------------------\n");

  // 2. Read src/data.ts and extract image paths
  let dataContent = '';
  let dataImages = [];
  try {
    dataContent = fs.readFileSync(dataFile, 'utf-8');
    const imageRegex = /image:\s*['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = imageRegex.exec(dataContent)) !== null) {
      dataImages.push(match[1]);
    }
    console.log(`Found ${dataImages.length} image paths in src/data.ts:`);
    dataImages.forEach(img => console.log(` - ${img}`));
  } catch (err) {
    console.error(`Error reading data.ts: ${err.message}`);
  }

  console.log("\n---------------------------\n");

  // 3. Compare them
  console.log("Discrepancies:");
  dataImages.forEach(imgPath => {
    // extract filename without query string
    const basePath = imgPath.split('?')[0];
    const fileName = path.basename(basePath);
    if (!filesInDir.includes(fileName)) {
      console.log(` ❌ ${fileName} is in data.ts but MISSING from public/images/lawns/`);
    } else {
      console.log(` ✅ ${fileName} matches folder`);
    }
  });

  filesInDir.forEach(fileName => {
    const isInData = dataImages.some(imgPath => {
        const basePath = imgPath.split('?')[0];
        return path.basename(basePath) === fileName;
    });
    if (!isInData) {
      console.log(` ⚠️ ${fileName} is in folder but NOT USED in data.ts`);
    }
  });

  console.log("\n---------------------------\n");

  // 4. Check HTTP Accessibility
  console.log("Checking HTTP accessibility via localhost:3000:");
  for (const imgPath of dataImages) {
    try {
      const res = await fetch(`http://localhost:3000${imgPath}`);
      if (res.ok) {
        console.log(` ✅ [HTTP ${res.status}] ${imgPath} is accessible`);
      } else {
        console.log(` ❌ [HTTP ${res.status}] ${imgPath} is NOT accessible`);
      }
    } catch (err) {
      console.log(` ❌ [HTTP ERROR] ${imgPath} : ${err.message}`);
    }
  }

  console.log("\n=== Diagnostics Complete ===");
}

runDiagnostics();
