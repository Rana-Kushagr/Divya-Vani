// scripts/download_all_ncert.mjs
// Comprehensive NCERT Textbook & Sub-Book Downloader
// Classes: 6 to 12
// Subjects: Science, Mathematics, Social Science (History, Geo, Civics, Eco), Hindi, Sanskrit, English
import fs from 'node:fs';
import path from 'node:path';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/pdf,*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'close'
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPdfBuffer(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: HEADERS,
        signal: AbortSignal.timeout(15000)
      });
      if (res.status === 404) {
        return null; // Explicit 404, don't retry
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length > 500 && buffer.subarray(0, 4).toString('ascii') === '%PDF') {
        return buffer;
      }
      return null;
    } catch {
      if (attempt === maxRetries) {
        return null;
      }
      await sleep(500 * attempt);
    }
  }
  return null;
}

// Master Book Catalog with all primary books and sub-books
// targetDirs: array of directory paths relative to public/books/
const DOWNLOAD_JOBS = [
  // ==================== CLASS 6 ====================
  // Science: Curiosity (fecu1)
  { code: 'fecu1', start: 1, end: 12, targetDirs: ['class-6/science'] },
  // Maths: Ganita Prakash (fegp1)
  { code: 'fegp1', start: 1, end: 10, targetDirs: ['class-6/maths'] },
  // Social Science: Exploring Society India and Beyond (fees1)
  { code: 'fees1', start: 1, end: 14, targetDirs: ['class-6/social-science', 'class-6/social-science/exploring-society'] },
  // Hindi: Malhar (fhml1)
  { code: 'fhml1', start: 1, end: 13, targetDirs: ['class-6/hindi'] },
  // Sanskrit: Deepakam (fsde1)
  { code: 'fsde1', start: 1, end: 16, targetDirs: ['class-6/sanskrit'] },
  // English: Poorvi (fepr1)
  { code: 'fepr1', start: 1, end: 5, targetDirs: ['class-6/english'] },

  // ==================== CLASS 7 ====================
  // Science: Science (gesc1, 13 chs) & Curiosity (gecu1, 12 chs)
  { code: 'gesc1', start: 1, end: 13, targetDirs: ['class-7/science'] },
  { code: 'gecu1', start: 1, end: 12, targetDirs: ['class-7/science/curiosity'] },
  // Maths: Ganita Prakash-I (gegp1, 8 chs) & Ganita Prakash-II (gegp2, 7 chs)
  { code: 'gegp1', start: 1, end: 8, targetDirs: ['class-7/maths', 'class-7/maths/part-1'] },
  { code: 'gegp2', start: 1, end: 7, targetDirs: ['class-7/maths/part-2'] },
  // Social Science:
  // History: Our Pasts II (gess1)
  { code: 'gess1', start: 1, end: 8, targetDirs: ['class-7/social-science', 'class-7/social-science/history'] },
  // Geography: Our Environment (gess2)
  { code: 'gess2', start: 1, end: 8, targetDirs: ['class-7/social-science/geography'] },
  // Exploring Society Part-I (gees1) & Part-II (gees2)
  { code: 'gees1', start: 1, end: 12, targetDirs: ['class-7/social-science/exploring-society-1'] },
  { code: 'gees2', start: 1, end: 8, targetDirs: ['class-7/social-science/exploring-society-2'] },
  // Hindi: Vasant (ghvs1, 15 chs) & Malhar (ghml1, 10 chs)
  { code: 'ghvs1', start: 1, end: 15, targetDirs: ['class-7/hindi'] },
  { code: 'ghml1', start: 1, end: 10, targetDirs: ['class-7/hindi/malhar'] },
  // Sanskrit: Deepakam (gsde1, 15 chs)
  { code: 'gsde1', start: 1, end: 15, targetDirs: ['class-7/sanskrit'] },
  // English: Honeycomb (gehc1, 8 chs) & An Alien Hand (geah1, 8 chs) & Poorvi (gepr1, 5 chs)
  { code: 'gehc1', start: 1, end: 8, targetDirs: ['class-7/english'] },
  { code: 'geah1', start: 1, end: 8, targetDirs: ['class-7/english/alien-hand'] },
  { code: 'gepr1', start: 1, end: 5, targetDirs: ['class-7/english/poorvi'] },

  // ==================== CLASS 8 ====================
  // Science: Science (hesc1, 13 chs)
  { code: 'hesc1', start: 1, end: 13, targetDirs: ['class-8/science'] },
  // Maths: Mathematics (hemh1, 13 chs)
  { code: 'hemh1', start: 1, end: 13, targetDirs: ['class-8/maths'] },
  // Social Science:
  // History: Our Pasts III (hess2, 8 chs)
  { code: 'hess2', start: 1, end: 8, targetDirs: ['class-8/social-science', 'class-8/social-science/history'] },
  // Civics: Social and Political Life III (hess3, 8 chs)
  { code: 'hess3', start: 1, end: 8, targetDirs: ['class-8/social-science/civics'] },
  // Geography: Resource and Development (hess4, 5 chs)
  { code: 'hess4', start: 1, end: 5, targetDirs: ['class-8/social-science/geography'] },
  // Hindi: Vasant (hhvs1, 13 chs)
  { code: 'hhvs1', start: 1, end: 13, targetDirs: ['class-8/hindi'] },
  // Sanskrit: Deepakam (hsde1, 15 chs)
  { code: 'hsde1', start: 1, end: 15, targetDirs: ['class-8/sanskrit'] },
  // English: Honeydew (hehd1, 8 chs) & It So Happened (heih1, 8 chs)
  { code: 'hehd1', start: 1, end: 8, targetDirs: ['class-8/english'] },
  { code: 'heih1', start: 1, end: 8, targetDirs: ['class-8/english/it-so-happened'] },

  // ==================== CLASS 9 ====================
  // Science: Science (iesc1, 13 chs)
  { code: 'iesc1', start: 1, end: 13, targetDirs: ['class-9/science'] },
  // Maths: Mathematics (iemh1, 8 chs)
  { code: 'iemh1', start: 1, end: 8, targetDirs: ['class-9/maths'] },
  // Social Science: Understanding Society Part I (iest1, 9 chs) & Part II (iest2, 6 chs)
  { code: 'iest1', start: 1, end: 9, targetDirs: ['class-9/social-science', 'class-9/social-science/understanding-society-1'] },
  { code: 'iest2', start: 1, end: 6, targetDirs: ['class-9/social-science/understanding-society-2'] },
  // Hindi: Reva (reva1, 10 chs) & Gadhya (ihga1, 12 chs)
  { code: 'reva1', start: 1, end: 10, targetDirs: ['class-9/hindi'] },
  { code: 'ihga1', start: 1, end: 12, targetDirs: ['class-9/hindi/gadhyapadya'] },
  // Sanskrit: Shemushi (ihsh1, 14 chs) & Vyakaranavithi (jhva1, 12 chs)
  { code: 'ihsh1', start: 1, end: 14, targetDirs: ['class-9/sanskrit'] },
  { code: 'jhva1', start: 1, end: 12, targetDirs: ['class-9/sanskrit/vyakaran'] },
  // English: Beehive (iebe1, 9 chs)
  { code: 'iebe1', start: 1, end: 9, targetDirs: ['class-9/english'] },

  // ==================== CLASS 10 ====================
  // Science: Science (jesc1, 13 chs)
  { code: 'jesc1', start: 1, end: 13, targetDirs: ['class-10/science'] },
  // Maths: Mathematics (jemh1, 14 chs)
  { code: 'jemh1', start: 1, end: 14, targetDirs: ['class-10/maths'] },
  // Social Science: ALL 4 SUB-BOOKS!
  // Geography: Contemporary India II (jess1, 7 chs)
  { code: 'jess1', start: 1, end: 7, targetDirs: ['class-10/social-science', 'class-10/social-science/geography'] },
  // Economics: Understanding Economic Development (jess2, 5 chs)
  { code: 'jess2', start: 1, end: 5, targetDirs: ['class-10/social-science/economics'] },
  // History: India and the Contemporary World II (jess3, 5 chs)
  { code: 'jess3', start: 1, end: 5, targetDirs: ['class-10/social-science/history'] },
  // Civics: Democratic Politics II (jess4, 5 chs)
  { code: 'jess4', start: 1, end: 5, targetDirs: ['class-10/social-science/civics'] },
  // Hindi: Kshitij (jhks1, 12 chs) & Sparsh (jhsp1, 14 chs)
  { code: 'jhks1', start: 1, end: 12, targetDirs: ['class-10/hindi'] },
  { code: 'jhsp1', start: 1, end: 14, targetDirs: ['class-10/hindi/sparsh'] },
  // Sanskrit: Shemushi (jhsk1, 10 chs)
  { code: 'jhsk1', start: 1, end: 10, targetDirs: ['class-10/sanskrit'] },
  // English: First Flight (jeff1, 9 chs) & Footprints Without Feet (jefp1, 9 chs)
  { code: 'jeff1', start: 1, end: 9, targetDirs: ['class-10/english'] },
  { code: 'jefp1', start: 1, end: 9, targetDirs: ['class-10/english/footprints'] },

  // ==================== CLASS 11 ====================
  // Science: Physics Part I (keph1) & Part II (keph2)
  { code: 'keph1', start: 1, end: 7, targetDirs: ['class-11/science', 'class-11/science/physics'] },
  { code: 'keph2', start: 1, end: 6, targetDirs: ['class-11/science/physics-part2'] },
  // Science: Chemistry Part I (kech1) & Part II (kech2)
  { code: 'kech1', start: 1, end: 6, targetDirs: ['class-11/science/chemistry'] },
  { code: 'kech2', start: 1, end: 6, targetDirs: ['class-11/science/chemistry-part2'] },
  // Science: Biology (kebo1, 19 chs)
  { code: 'kebo1', start: 1, end: 19, targetDirs: ['class-11/science/biology'] },
  // Maths: Mathematics (kemh1, 14 chs)
  { code: 'kemh1', start: 1, end: 14, targetDirs: ['class-11/maths'] },
  // Social Science:
  // History: Themes in World History (kehs1, 7 chs)
  { code: 'kehs1', start: 1, end: 7, targetDirs: ['class-11/social-science', 'class-11/social-science/history'] },
  // Geography: India Physical Environment (kegy1, 6 chs) & Physical Geography (kegy2, 14 chs)
  { code: 'kegy1', start: 1, end: 6, targetDirs: ['class-11/social-science/geography'] },
  { code: 'kegy2', start: 1, end: 14, targetDirs: ['class-11/social-science/geography-fundamentals'] },
  // Political Science: Political Theory (keps1, 8 chs) & Constitution (keps2, 10 chs)
  { code: 'keps1', start: 1, end: 8, targetDirs: ['class-11/social-science/political-science'] },
  { code: 'keps2', start: 1, end: 10, targetDirs: ['class-11/social-science/constitution'] },
  // Economics: Indian Economic Development (keec1, 8 chs) & Statistics (kest1, 8 chs)
  { code: 'keec1', start: 1, end: 8, targetDirs: ['class-11/social-science/economics'] },
  { code: 'kest1', start: 1, end: 8, targetDirs: ['class-11/social-science/statistics'] },
  // Hindi: Antra (khat1, 16 chs) & Aroh (khar1, 16 chs) & Vitan (khvt1, 5 chs)
  { code: 'khat1', start: 1, end: 16, targetDirs: ['class-11/hindi'] },
  { code: 'khar1', start: 1, end: 16, targetDirs: ['class-11/hindi/aroh'] },
  { code: 'khvt1', start: 1, end: 5, targetDirs: ['class-11/hindi/vitan'] },
  // Sanskrit: Bhaswati (khsk1, 11 chs) & Shashwati (khsk2, 11 chs)
  { code: 'khsk1', start: 1, end: 11, targetDirs: ['class-11/sanskrit'] },
  { code: 'khsk2', start: 1, end: 11, targetDirs: ['class-11/sanskrit/shashwati'] },
  // English: Hornbill (kehb1, 14 chs) & Snapshots (kesp1, 5 chs) & Woven Words (keww1, 27 chs)
  { code: 'kehb1', start: 1, end: 14, targetDirs: ['class-11/english'] },
  { code: 'kesp1', start: 1, end: 5, targetDirs: ['class-11/english/snapshots'] },
  { code: 'keww1', start: 1, end: 15, targetDirs: ['class-11/english/woven-words'] },

  // ==================== CLASS 12 ====================
  // Science: Physics Part I (leph1) & Part II (leph2)
  { code: 'leph1', start: 1, end: 8, targetDirs: ['class-12/science', 'class-12/science/physics'] },
  { code: 'leph2', start: 1, end: 6, targetDirs: ['class-12/science/physics-part2'] },
  // Science: Chemistry Part I (lech1) & Part II (lech2)
  { code: 'lech1', start: 1, end: 5, targetDirs: ['class-12/science/chemistry'] },
  { code: 'lech2', start: 1, end: 5, targetDirs: ['class-12/science/chemistry-part2'] },
  // Science: Biology (lebo1, 13 chs)
  { code: 'lebo1', start: 1, end: 13, targetDirs: ['class-12/science/biology'] },
  // Maths: Mathematics Part I (lemh1, 6 chs) & Part II (lemh2, 7 chs)
  { code: 'lemh1', start: 1, end: 6, targetDirs: ['class-12/maths', 'class-12/maths/part-1'] },
  { code: 'lemh2', start: 1, end: 7, targetDirs: ['class-12/maths/part-2'] },
  // Social Science:
  // History: Themes in Indian History I (lehs1, 4 chs), II (lehs2, 4 chs), III (lehs3, 4 chs)
  { code: 'lehs1', start: 1, end: 4, targetDirs: ['class-12/social-science', 'class-12/social-science/history-1'] },
  { code: 'lehs2', start: 1, end: 4, targetDirs: ['class-12/social-science/history-2'] },
  { code: 'lehs3', start: 1, end: 4, targetDirs: ['class-12/social-science/history-3'] },
  // Geography: Fundamentals of Human Geography (legy1, 8 chs) & India People and Economy (legy2, 9 chs)
  { code: 'legy1', start: 1, end: 8, targetDirs: ['class-12/social-science/geography'] },
  { code: 'legy2', start: 1, end: 9, targetDirs: ['class-12/social-science/geography-economy'] },
  // Political Science: Contemporary World Politics (leps1, 7 chs) & Politics in India (leps2, 8 chs)
  { code: 'leps1', start: 1, end: 7, targetDirs: ['class-12/social-science/political-science'] },
  { code: 'leps2', start: 1, end: 8, targetDirs: ['class-12/social-science/politics-in-india'] },
  // Economics: Introductory Macroeconomics (leec1, 6 chs) & Microeconomics (leec2, 5 chs)
  { code: 'leec1', start: 1, end: 6, targetDirs: ['class-12/social-science/economics'] },
  { code: 'leec2', start: 1, end: 5, targetDirs: ['class-12/social-science/microeconomics'] },
  // Hindi: Antra (lhat1, 21 chs) & Aroh (lhar1, 15 chs) & Vitan (lhvt1, 3 chs)
  { code: 'lhat1', start: 1, end: 16, targetDirs: ['class-12/hindi'] },
  { code: 'lhar1', start: 1, end: 15, targetDirs: ['class-12/hindi/aroh'] },
  { code: 'lhvt1', start: 1, end: 3, targetDirs: ['class-12/hindi/vitan'] },
  // Sanskrit: Bhaswati (lhsk1, 10 chs) & Shashwati (lhsk2, 11 chs)
  { code: 'lhsk1', start: 1, end: 10, targetDirs: ['class-12/sanskrit'] },
  { code: 'lhsk2', start: 1, end: 11, targetDirs: ['class-12/sanskrit/shashwati'] },
  // English: Flamingo (lefl1, 13 chs) & Vistas (levt1, 6 chs) & Kaleidoscope (lekl1, 15 chs)
  { code: 'lefl1', start: 1, end: 13, targetDirs: ['class-12/english'] },
  { code: 'levt1', start: 1, end: 6, targetDirs: ['class-12/english/vistas'] },
  { code: 'lekl1', start: 1, end: 15, targetDirs: ['class-12/english/kaleidoscope'] }
];

async function run() {
  console.log('='.repeat(75));
  console.log('DIVYAVANI MASTER NCERT TEXTBOOK & SUB-BOOK DOWNLOAD PIPELINE');
  console.log('='.repeat(75));
  console.log(`Processing ${DOWNLOAD_JOBS.length} book/sub-book tracks across Classes 6–12...\n`);

  let alreadyCached = 0;
  let freshlyDownloaded = 0;
  let notFound = 0;

  for (const job of DOWNLOAD_JOBS) {
    const { code, start, end, targetDirs } = job;
    console.log(`\n📚 [Track ${code}] Ch ${start}..${end} -> ${targetDirs.join(' & ')}`);

    for (let ch = start; ch <= end; ch++) {
      const ch2Digit = String(ch).padStart(2, '0');
      const fileName = `ch-${ch2Digit}.pdf`;

      // Check if all target directories already have this file
      let allTargetsExist = true;
      for (const tDir of targetDirs) {
        const dest = path.join('public', 'books', tDir, fileName);
        if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
          allTargetsExist = false;
          break;
        }
      }

      if (allTargetsExist) {
        alreadyCached++;
        continue;
      }

      // Check if ANY target directory already has a valid copy we can replicate
      let existingBuffer = null;
      for (const tDir of targetDirs) {
        const dest = path.join('public', 'books', tDir, fileName);
        if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
          existingBuffer = fs.readFileSync(dest);
          break;
        }
      }

      if (existingBuffer) {
        // Copy to missing target dirs
        for (const tDir of targetDirs) {
          const dest = path.join('public', 'books', tDir, fileName);
          if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.writeFileSync(dest, existingBuffer);
          }
        }
        alreadyCached++;
        continue;
      }

      // Fetch from NCERT server
      const url = `https://ncert.nic.in/textbook/pdf/${code}${ch2Digit}.pdf`;
      const pdfBuffer = await fetchPdfBuffer(url);

      if (pdfBuffer) {
        for (const tDir of targetDirs) {
          const dest = path.join('public', 'books', tDir, fileName);
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, pdfBuffer);
        }
        freshlyDownloaded++;
        const sizeKb = (pdfBuffer.length / 1024).toFixed(1);
        console.log(`  ✅ [200 OK] Ch ${ch2Digit} (${sizeKb} KB) -> ${targetDirs[0]}/${fileName}`);
      } else {
        notFound++;
        console.log(`  ⚠️  [404 / Skip] Ch ${ch2Digit} (${code}${ch2Digit}.pdf)`);
      }

      // 150ms gentle throttle between remote requests
      await sleep(150);
    }
  }

  console.log('\n' + '='.repeat(75));
  console.log('MASTER NCERT DOWNLOAD PROCESS COMPLETE');
  console.log(`  - Freshly Downloaded: ${freshlyDownloaded}`);
  console.log(`  - Cached / Replicated: ${alreadyCached}`);
  console.log(`  - Not Found / 404:     ${notFound}`);
  console.log('='.repeat(75));
}

await run();
