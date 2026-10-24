// scripts/download_all_ncert.mjs
// Comprehensive Official NCERT Textbook Downloader
// Classes: 6 to 12
// Subjects: Science, Mathematics, Social Science, Hindi, Sanskrit, English
import fs from 'node:fs';
import path from 'node:path';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/pdf,*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'close'
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPdfBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length > 500 && buffer.subarray(0, 4).toString('ascii') === '%PDF') {
      return buffer;
    }
    return null;
  } catch {
    return null;
  }
}

// Master Book Catalog with all primary books and sub-books
const DOWNLOAD_JOBS = [
  // Class 6
  { code: 'fecu1', start: 1, end: 12, targetDirs: ['class-6/science'] },
  { code: 'fegp1', start: 1, end: 10, targetDirs: ['class-6/maths'] },
  { code: 'fees1', start: 1, end: 14, targetDirs: ['class-6/social-science', 'class-6/social-science/exploring-society'] },
  { code: 'fhml1', start: 1, end: 13, targetDirs: ['class-6/hindi'] },
  { code: 'fsde1', start: 1, end: 16, targetDirs: ['class-6/sanskrit'] },
  { code: 'feap1', start: 1, end: 8, targetDirs: ['class-6/english'] },

  // Class 7
  { code: 'gesc1', start: 1, end: 13, targetDirs: ['class-7/science'] },
  { code: 'gemh1', start: 1, end: 13, targetDirs: ['class-7/maths'] },
  { code: 'gess1', start: 1, end: 8, targetDirs: ['class-7/social-science', 'class-7/social-science/history'] },
  { code: 'gess2', start: 1, end: 7, targetDirs: ['class-7/social-science/geography'] },
  { code: 'gess3', start: 1, end: 8, targetDirs: ['class-7/social-science/civics'] },
  { code: 'ghvs1', start: 1, end: 15, targetDirs: ['class-7/hindi'] },
  { code: 'gssk1', start: 1, end: 14, targetDirs: ['class-7/sanskrit'] },
  { code: 'gehc1', start: 1, end: 8, targetDirs: ['class-7/english'] },

  // Class 8
  { code: 'hesc1', start: 1, end: 13, targetDirs: ['class-8/science'] },
  { code: 'hemh1', start: 1, end: 13, targetDirs: ['class-8/maths'] },
  { code: 'hess2', start: 1, end: 8, targetDirs: ['class-8/social-science', 'class-8/social-science/history'] },
  { code: 'hess3', start: 1, end: 8, targetDirs: ['class-8/social-science/civics'] },
  { code: 'hess4', start: 1, end: 5, targetDirs: ['class-8/social-science/geography'] },
  { code: 'hhvs1', start: 1, end: 13, targetDirs: ['class-8/hindi'] },
  { code: 'hsde1', start: 1, end: 15, targetDirs: ['class-8/sanskrit'] },
  { code: 'hehd1', start: 1, end: 8, targetDirs: ['class-8/english'] },

  // Class 9
  { code: 'iesc1', start: 1, end: 12, targetDirs: ['class-9/science'] },
  { code: 'iemh1', start: 1, end: 12, targetDirs: ['class-9/maths'] },
  { code: 'iehs1', start: 1, end: 5, targetDirs: ['class-9/social-science', 'class-9/social-science/history'] },
  { code: 'iegy1', start: 1, end: 6, targetDirs: ['class-9/social-science/geography'] },
  { code: 'ieps1', start: 1, end: 5, targetDirs: ['class-9/social-science/civics'] },
  { code: 'ieec1', start: 1, end: 4, targetDirs: ['class-9/social-science/economics'] },
  { code: 'ihks1', start: 1, end: 13, targetDirs: ['class-9/hindi'] },
  { code: 'ihsh1', start: 1, end: 10, targetDirs: ['class-9/sanskrit'] },
  { code: 'jhva1', start: 1, end: 12, targetDirs: ['class-9/sanskrit/vyakaran'] },
  { code: 'iebe1', start: 1, end: 9, targetDirs: ['class-9/english'] },

  // Class 10
  { code: 'jesc1', start: 1, end: 13, targetDirs: ['class-10/science'] },
  { code: 'jemh1', start: 1, end: 14, targetDirs: ['class-10/maths'] },
  { code: 'jess3', start: 1, end: 5, targetDirs: ['class-10/social-science/history'] },
  { code: 'jess1', start: 1, end: 7, targetDirs: ['class-10/social-science', 'class-10/social-science/geography'] },
  { code: 'jess4', start: 1, end: 5, targetDirs: ['class-10/social-science/civics'] },
  { code: 'jess2', start: 1, end: 5, targetDirs: ['class-10/social-science/economics'] },
  { code: 'jhsp1', start: 1, end: 14, targetDirs: ['class-10/hindi', 'class-10/hindi/sparsh'] },
  { code: 'jhsy1', start: 1, end: 3, targetDirs: ['class-10/hindi/sanchayan'] },
  { code: 'jhsk1', start: 1, end: 10, targetDirs: ['class-10/sanskrit'] },
  { code: 'jeff1', start: 1, end: 9, targetDirs: ['class-10/english', 'class-10/english/first-flight'] },
  { code: 'jefp1', start: 1, end: 9, targetDirs: ['class-10/english/footprints'] },

  // Class 11
  { code: 'keph1', start: 1, end: 7, targetDirs: ['class-11/science', 'class-11/science/physics'] },
  { code: 'keph2', start: 1, end: 7, targetDirs: ['class-11/science/physics-part2'] },
  { code: 'kech1', start: 1, end: 6, targetDirs: ['class-11/science/chemistry'] },
  { code: 'kech2', start: 1, end: 6, targetDirs: ['class-11/science/chemistry-part2'] },
  { code: 'kebo1', start: 1, end: 19, targetDirs: ['class-11/science/biology'] },
  { code: 'kemh1', start: 1, end: 14, targetDirs: ['class-11/maths'] },
  { code: 'kehs1', start: 1, end: 4, targetDirs: ['class-11/social-science', 'class-11/social-science/history'] },
  { code: 'kegy1', start: 1, end: 6, targetDirs: ['class-11/social-science/geography'] },
  { code: 'keps1', start: 1, end: 8, targetDirs: ['class-11/social-science/political-science'] },
  { code: 'khar1', start: 1, end: 16, targetDirs: ['class-11/hindi', 'class-11/hindi/aroh'] },
  { code: 'khsk1', start: 1, end: 11, targetDirs: ['class-11/sanskrit'] },
  { code: 'kehb1', start: 1, end: 14, targetDirs: ['class-11/english'] },

  // Class 12
  { code: 'leph1', start: 1, end: 8, targetDirs: ['class-12/science', 'class-12/science/physics'] },
  { code: 'leph2', start: 1, end: 6, targetDirs: ['class-12/science/physics-part2'] },
  { code: 'lech1', start: 1, end: 5, targetDirs: ['class-12/science/chemistry'] },
  { code: 'lech2', start: 1, end: 5, targetDirs: ['class-12/science/chemistry-part2'] },
  { code: 'lebo1', start: 1, end: 13, targetDirs: ['class-12/science/biology'] },
  { code: 'lemh1', start: 1, end: 6, targetDirs: ['class-12/maths'] },
  { code: 'lehs1', start: 1, end: 4, targetDirs: ['class-12/social-science', 'class-12/social-science/history'] },
  { code: 'legy1', start: 1, end: 8, targetDirs: ['class-12/social-science/geography'] },
  { code: 'leps1', start: 1, end: 7, targetDirs: ['class-12/social-science/political-science'] },
  { code: 'lhar1', start: 1, end: 15, targetDirs: ['class-12/hindi', 'class-12/hindi/aroh'] },
  { code: 'lhsk1', start: 1, end: 10, targetDirs: ['class-12/sanskrit'] },
  { code: 'lefl1', start: 1, end: 13, targetDirs: ['class-12/english'] }
];

function checkAllTargetsExist(targetDirs, fileName) {
  return targetDirs.every((tDir) => {
    const dest = path.join('public', 'books', tDir, fileName);
    return fs.existsSync(dest) && fs.statSync(dest).size > 1000;
  });
}

function findExistingBuffer(targetDirs, fileName) {
  for (const tDir of targetDirs) {
    const dest = path.join('public', 'books', tDir, fileName);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return fs.readFileSync(dest);
    }
  }
  return null;
}

function saveBufferToTargets(targetDirs, fileName, buffer) {
  for (const tDir of targetDirs) {
    const dest = path.join('public', 'books', tDir, fileName);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
  }
}

async function downloadSingleChapter(job, ch, stats) {
  const ch2Digit = String(ch).padStart(2, '0');
  const fileName = `ch-${ch2Digit}.pdf`;

  if (checkAllTargetsExist(job.targetDirs, fileName)) {
    stats.cached++;
    return;
  }

  const existing = findExistingBuffer(job.targetDirs, fileName);
  if (existing) {
    saveBufferToTargets(job.targetDirs, fileName, existing);
    stats.cached++;
    return;
  }

  const url = `https://ncert.nic.in/textbook/pdf/${job.code}${ch2Digit}.pdf`;
  const pdfBuffer = await fetchPdfBuffer(url);

  if (pdfBuffer) {
    saveBufferToTargets(job.targetDirs, fileName, pdfBuffer);
    stats.downloaded++;
    console.log(`  ✅ [200 OK] Ch ${ch2Digit} -> ${job.targetDirs[0]}/${fileName}`);
  } else {
    stats.notFound++;
    console.log(`  ⚠️  [404 / Skip] Ch ${ch2Digit} (${job.code}${ch2Digit}.pdf)`);
  }
  await delay(150);
}

async function processTrack(job, stats) {
  console.log(`\n📚 [Track ${job.code}] Ch ${job.start}..${job.end} -> ${job.targetDirs.join(' & ')}`);
  for (let ch = job.start; ch <= job.end; ch++) {
    await downloadSingleChapter(job, ch, stats);
  }
}

async function run() {
  console.log('DIVYAVANI MASTER NCERT TEXTBOOK DOWNLOAD PIPELINE');
  console.log(`Processing ${DOWNLOAD_JOBS.length} tracks...\n`);

  const stats = { cached: 0, downloaded: 0, notFound: 0 };
  for (const job of DOWNLOAD_JOBS) {
    await processTrack(job, stats);
  }

  console.log('\nDOWNLOAD PROCESS COMPLETE');
  console.log(`Cached: ${stats.cached} | Downloaded: ${stats.downloaded} | 404: ${stats.notFound}`);
}

await run();
