// scripts/safe_cleanup_desktop.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const USER_DIR = 'C:/Users/Lakshit Rana/OneDrive/Desktop/Lucky\'s Materials/Chapters';
const APP_BOOKS_DIR = 'C:/Users/Lakshit Rana/.gemini/antigravity/scratch/Divya-Vani/public/books';

console.log('=== Safe Verification & Cleanup of Local Desktop Chapters ===\n');

if (!fs.existsSync(USER_DIR)) {
  console.log(`Directory does not exist: ${USER_DIR}`);
  process.exit(0);
}

// Build content hash index of all files in public/books
console.log('1. Indexing public/books repository archive...');
const repoHashes = new Set();
const repoPaths = new Set();

function indexRepo(dir) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const s = fs.statSync(p);
    if (s.isDirectory()) {
      indexRepo(p);
    } else if (item.endsWith('.pdf')) {
      repoPaths.add(path.relative(APP_BOOKS_DIR, p).replace(/\\/g, '/'));
      // Sample fast hash
      const fd = fs.openSync(p, 'r');
      const b1 = Buffer.alloc(8192);
      const r1 = fs.readSync(fd, b1, 0, 8192, 0);
      const b2 = Buffer.alloc(8192);
      const pos2 = Math.max(0, s.size - 8192);
      const r2 = fs.readSync(fd, b2, 0, 8192, pos2);
      fs.closeSync(fd);
      const h = crypto.createHash('md5').update(String(s.size)).update(b1.subarray(0, r1)).update(b2.subarray(0, r2)).digest('hex');
      repoHashes.add(h);
    }
  }
}

indexRepo(APP_BOOKS_DIR);
console.log(`Indexed ${repoPaths.size} repository PDFs.\n`);

console.log('2. Verifying and removing local desktop copies...');
let deletedCount = 0;
let deletedBytes = 0;
let skippedCount = 0;

function cleanUserDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const s = fs.statSync(p);
    if (s.isDirectory()) {
      cleanUserDir(p);
      // Remove empty directory if empty
      try {
        if (fs.readdirSync(p).length === 0) {
          fs.rmdirSync(p);
        }
      } catch {}
    } else if (item.endsWith('.pdf')) {
      const rel = path.relative(USER_DIR, p).replace(/\\/g, '/');
      
      // Fast hash
      const fd = fs.openSync(p, 'r');
      const b1 = Buffer.alloc(8192);
      const r1 = fs.readSync(fd, b1, 0, 8192, 0);
      const b2 = Buffer.alloc(8192);
      const pos2 = Math.max(0, s.size - 8192);
      const r2 = fs.readSync(fd, b2, 0, 8192, pos2);
      fs.closeSync(fd);
      const h = crypto.createHash('md5').update(String(s.size)).update(b1.subarray(0, r1)).update(b2.subarray(0, r2)).digest('hex');

      // Check if safely exists in repo
      if (repoPaths.has(rel) || repoHashes.has(h)) {
        fs.unlinkSync(p);
        deletedCount++;
        deletedBytes += s.size;
      } else {
        console.warn(`⚠️ Skipped (not found in repo): ${rel}`);
        skippedCount++;
      }
    }
  }
}

cleanUserDir(USER_DIR);

// Clean up root user dir if empty
try {
  if (fs.readdirSync(USER_DIR).length === 0) {
    fs.rmdirSync(USER_DIR);
  }
} catch {}

console.log(`\n🎉 Safe Cleanup Complete!`);
console.log(`Deleted: ${deletedCount} verified PDF files.`);
console.log(`Freed Space: ${(deletedBytes / (1024 * 1024)).toFixed(2)} MB (${(deletedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB).`);
if (skippedCount > 0) {
  console.log(`Preserved ${skippedCount} files that did not have verified copies in the repo.`);
}
