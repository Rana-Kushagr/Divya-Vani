// scripts/push_all_batches.mjs
import { execSync } from 'node:child_process';
import path from 'node:path';

const REPO_DIR = 'C:/Users/Lakshit Rana/.gemini/antigravity/scratch/Divya-Vani';

function run(cmd, silent = false) {
  try {
    return execSync(cmd, { cwd: REPO_DIR, encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
  } catch (err) {
    if (!silent) console.error(`Error running: ${cmd}`, err.message);
    throw err;
  }
}

const BATCHES = [
  { name: 'Class 9', path: 'public/books/class-9', msg: 'feat(books): add Class 9 English, Hindi, SST, and Sanskrit books' },
  { name: 'Class 8', path: 'public/books/class-8', msg: 'feat(books): add Class 8 English, Sanskrit, and SST books' },
  { name: 'Class 7', path: 'public/books/class-7', msg: 'feat(books): add Class 7 English, Sanskrit, Science, and SST books' },
  { name: 'Class 6', path: 'public/books/class-6', msg: 'feat(books): add Class 6 complete subjects books' },
  { name: 'Class 11', path: 'public/books/class-11', msg: 'feat(books): add Class 11 Science, SST, and Hindi books' },
  { name: 'Class 12', path: 'public/books/class-12', msg: 'feat(books): add Class 12 Sanskrit and Higher Secondary books' },
  { name: 'Scripts & Tools', path: 'scripts', msg: 'chore: update official NCERT download and sync scripts' }
];

async function main() {
  console.log('=== Automated Sequential Class Batch Uploader to GitHub ===\n');

  for (const batch of BATCHES) {
    console.log(`\n▶️ Processing [${batch.name}] (${batch.path})...`);
    
    // Stage
    run(`git add "${batch.path}"`);

    // Check if staged
    try {
      execSync('git diff --cached --quiet', { cwd: REPO_DIR });
      console.log(`⏩ No new changes to commit for [${batch.name}]. Skipping.`);
      continue;
    } catch {
      // Changes exist!
    }

    // Commit
    console.log(`💾 Committing [${batch.name}]...`);
    run(`git commit -m "${batch.msg}"`);

    // Push with retries
    let pushed = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🚀 Pushing [${batch.name}] to GitHub (attempt ${attempt}/3)...`);
        run('git push origin main');
        console.log(`✅ [${batch.name}] successfully pushed to GitHub!`);
        pushed = true;
        break;
      } catch (err) {
        console.warn(`⚠️ Push attempt ${attempt} failed: ${err.message}`);
        if (attempt < 3) {
          console.log('Waiting 5s before retrying push...');
          await new Promise(r => setTimeout(r, 5000));
        }
      }
    }

    if (!pushed) {
      console.error(`❌ Failed to push [${batch.name}] after 3 attempts.`);
      process.exit(1);
    }
  }

  console.log('\n🎉 ALL CLASSES AND SUBJECTS SUCCESSFULLY COMMITTED AND PUSHED TO GITHUB!');
}

main().catch(err => {
  console.error('Fatal batch push error:', err);
  process.exit(1);
});
