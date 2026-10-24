// scripts/clean_and_organize_books.mjs
import fs from 'node:fs';
import path from 'node:path';

const APP_BOOKS_DIR = 'C:/Users/Lakshit Rana/.gemini/antigravity/scratch/Divya-Vani/public/books';
const USER_DIR = 'C:/Users/Lakshit Rana/OneDrive/Desktop/Lucky\'s Materials/Chapters';

console.log('--- Step 1: Remove redundant duplicate folders in public/books ---');
const redundantDirs = [
  path.join(APP_BOOKS_DIR, 'class-10/hindi/course-b-sparsh'),
  path.join(APP_BOOKS_DIR, 'class-10/hindi/course-b-sanchayan'),
  path.join(APP_BOOKS_DIR, 'class-10/english/literature-footprints')
];

for (const d of redundantDirs) {
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
    console.log('Removed redundant folder:', path.relative(APP_BOOKS_DIR, d));
  }
}

console.log('\n--- Step 2: Remove duplicate raw NCERT code files in public/books ---');
let removedRawCount = 0;
let removedRawBytes = 0;

function removeRawDuplicates(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      removeRawDuplicates(full);
    } else if (item.endsWith('.pdf') && !item.startsWith('ch-')) {
      // Check if sibling ch-XX.pdf exists or convert it
      const match = item.match(/([a-zA-Z]+)(\d{2})\.pdf$/);
      if (match) {
        const chName = `ch-${match[2]}.pdf`;
        const sibling = path.join(dir, chName);
        if (!fs.existsSync(sibling)) {
          // If ch-XX.pdf doesn't exist, rename raw file to ch-XX.pdf!
          fs.renameSync(full, sibling);
          console.log(`Renamed raw file to canonical: ${item} -> ${chName} in ${path.relative(APP_BOOKS_DIR, dir)}`);
          continue;
        }
      }
      // If sibling already exists, delete raw duplicate!
      removedRawBytes += s.size;
      removedRawCount++;
      fs.unlinkSync(full);
    }
  }
}

removeRawDuplicates(APP_BOOKS_DIR);
console.log(`Removed ${removedRawCount} raw duplicate files (${(removedRawBytes / (1024 * 1024)).toFixed(2)} MB saved).`);

console.log('\n--- Step 3: Ensure Class 10 Hindi & English Canonical Setup ---');
// For Class 10 Hindi Course B: Sparsh chapters 1-14 should also be available at class-10/hindi/ch-XX.pdf
const sparshDir = path.join(APP_BOOKS_DIR, 'class-10/hindi/sparsh');
const hindiDir = path.join(APP_BOOKS_DIR, 'class-10/hindi');
if (fs.existsSync(sparshDir)) {
  for (const f of fs.readdirSync(sparshDir)) {
    if (f.startsWith('ch-') && f.endsWith('.pdf')) {
      const src = path.join(sparshDir, f);
      const dest = path.join(hindiDir, f);
      fs.copyFileSync(src, dest);
    }
  }
  console.log('Copied Sparsh chapters to canonical class-10/hindi/ root.');
}

// For Class 10 English: First Flight chapters 1-9 should also be in class-10/english/
const ffDir = path.join(APP_BOOKS_DIR, 'class-10/english/first-flight');
const engDir = path.join(APP_BOOKS_DIR, 'class-10/english');
if (fs.existsSync(ffDir)) {
  for (const f of fs.readdirSync(ffDir)) {
    if (f.startsWith('ch-') && f.endsWith('.pdf')) {
      const src = path.join(ffDir, f);
      const dest = path.join(engDir, f);
      fs.copyFileSync(src, dest);
    }
  }
  console.log('Copied First Flight chapters to canonical class-10/english/ root.');
}

console.log('\n--- Step 4: Final Verification of Clean App Books Directory ---');
let finalCount = 0;
let finalBytes = 0;
function countFinal(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const s = fs.statSync(full);
    if (s.isDirectory()) countFinal(full);
    else if (item.endsWith('.pdf')) {
      finalCount++;
      finalBytes += s.size;
    }
  }
}
countFinal(APP_BOOKS_DIR);
console.log(`Final Clean PDF Count in public/books: ${finalCount}`);
console.log(`Final Clean Total Size: ${(finalBytes / (1024 * 1024)).toFixed(2)} MB`);
