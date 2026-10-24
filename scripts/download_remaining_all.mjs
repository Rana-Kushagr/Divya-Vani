// scripts/download_remaining_all.mjs
// Master NCERT Downloader for All Classes & Subjects
// Features: Dual-directory persistence (Lucky's Materials/Chapters + public/books)
// Priority: Class 10 English Literature & Hindi Course B first, then all remaining classes & subjects

import fs from 'node:fs';
import path from 'node:path';

const USER_CHAPTERS_DIR = 'C:/Users/Lakshit Rana/OneDrive/Desktop/Lucky\'s Materials/Chapters';
const APP_BOOKS_DIR = 'C:/Users/Lakshit Rana/.gemini/antigravity/scratch/Divya-Vani/public/books';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/pdf,*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive'
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPdfBuffer(url, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: HEADERS,
        signal: AbortSignal.timeout(12000)
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length > 500 && buffer.subarray(0, 4).toString('ascii') === '%PDF') {
        return buffer;
      }
      return null;
    } catch {
      if (attempt === maxRetries) return null;
      await sleep(400 * attempt);
    }
  }
  return null;
}

// Master Track Definitions
const DOWNLOAD_TRACKS = [
  // =========================================================================
  // PRIORITY 1: CLASS 10 (English Literature + Hindi Course B + SST Sub-books)
  // =========================================================================
  // English Literature: First Flight (jeff1, 9 chs)
  {
    name: 'Class 10 English (First Flight Literature)',
    code: 'jeff1',
    start: 1,
    end: 9,
    folders: ['class-10/english', 'class-10/english/first-flight']
  },
  // English Literature Supplementary: Footprints Without Feet (jefp1, 9 chs)
  {
    name: 'Class 10 English (Footprints Without Feet Supplementary)',
    code: 'jefp1',
    start: 1,
    end: 9,
    folders: ['class-10/english/footprints', 'class-10/english/literature-footprints']
  },
  // English Workbook: Words and Expressions 2 (jewe2, 9 chs)
  {
    name: 'Class 10 English (Words and Expressions 2)',
    code: 'jewe2',
    start: 1,
    end: 9,
    folders: ['class-10/english/words-and-expressions']
  },
  // Hindi Course B: Sparsh Bhag-2 (jhsp1, 14 chs)
  {
    name: 'Class 10 Hindi Course B (Sparsh Bhag 2)',
    code: 'jhsp1',
    start: 1,
    end: 14,
    folders: ['class-10/hindi/course-b-sparsh', 'class-10/hindi/sparsh']
  },
  // Hindi Course B: Sanchayan Bhag-2 (jhsy1, 3 chs)
  {
    name: 'Class 10 Hindi Course B (Sanchayan Bhag 2)',
    code: 'jhsy1',
    start: 1,
    end: 3,
    folders: ['class-10/hindi/course-b-sanchayan', 'class-10/hindi/sanchayan']
  },
  // Social Science Sub-track: History (jess3, 5 chs)
  {
    name: 'Class 10 SST (History: India & Contemporary World II)',
    code: 'jess3',
    start: 1,
    end: 5,
    folders: ['class-10/social-science/history']
  },
  // Social Science Sub-track: Civics (jess4, 5 chs)
  {
    name: 'Class 10 SST (Civics: Democratic Politics II)',
    code: 'jess4',
    start: 1,
    end: 5,
    folders: ['class-10/social-science/civics']
  },
  // Social Science Sub-track: Economics (jess2, 5 chs)
  {
    name: 'Class 10 SST (Economics: Understanding Economic Dev)',
    code: 'jess2',
    start: 1,
    end: 5,
    folders: ['class-10/social-science/economics']
  },
  // Sanskrit: Shemushi (jhsk1, 10 chs)
  {
    name: 'Class 10 Sanskrit (Shemushi)',
    code: 'jhsk1',
    start: 1,
    end: 10,
    folders: ['class-10/sanskrit']
  },

  // =========================================================================
  // PRIORITY 2: CLASS 9
  // =========================================================================
  // English: Beehive (iebe1, 9 chs)
  {
    name: 'Class 9 English (Beehive)',
    code: 'iebe1',
    start: 1,
    end: 9,
    folders: ['class-9/english']
  },
  // Social Science: Understanding Society Part 1 (iest1, 9 chs) & Part 2 (iest2, 6 chs)
  {
    name: 'Class 9 SST (Understanding Society Part 1)',
    code: 'iest1',
    start: 1,
    end: 9,
    folders: ['class-9/social-science', 'class-9/social-science/understanding-society-1']
  },
  {
    name: 'Class 9 SST (Understanding Society Part 2)',
    code: 'iest2',
    start: 1,
    end: 6,
    folders: ['class-9/social-science/understanding-society-2']
  },
  // Hindi: Reva (reva1, 10 chs)
  {
    name: 'Class 9 Hindi (Reva)',
    code: 'reva1',
    start: 1,
    end: 10,
    folders: ['class-9/hindi']
  },
  // Sanskrit Vyakaran: Vyakaranavithi (jhva1, 12 chs)
  {
    name: 'Class 9 Sanskrit (Vyakaranavithi)',
    code: 'jhva1',
    start: 1,
    end: 12,
    folders: ['class-9/sanskrit/vyakaran']
  },

  // =========================================================================
  // PRIORITY 3: CLASS 8
  // =========================================================================
  // Social Science: Civics (hess3, 8 chs)
  {
    name: 'Class 8 SST (Civics: Social & Political Life III)',
    code: 'hess3',
    start: 1,
    end: 8,
    folders: ['class-8/social-science/civics']
  },
  // Social Science: Geography (hess4, 5 chs)
  {
    name: 'Class 8 SST (Geography: Resource & Development)',
    code: 'hess4',
    start: 1,
    end: 5,
    folders: ['class-8/social-science/geography']
  },
  // Sanskrit: Deepakam (hsde1, 15 chs)
  {
    name: 'Class 8 Sanskrit (Deepakam)',
    code: 'hsde1',
    start: 1,
    end: 15,
    folders: ['class-8/sanskrit']
  },
  // English: Honeydew (hehd1, 8 chs) & It So Happened (heih1, 8 chs)
  {
    name: 'Class 8 English (Honeydew)',
    code: 'hehd1',
    start: 1,
    end: 8,
    folders: ['class-8/english']
  },
  {
    name: 'Class 8 English (It So Happened)',
    code: 'heih1',
    start: 1,
    end: 8,
    folders: ['class-8/english/it-so-happened']
  },

  // =========================================================================
  // PRIORITY 4: CLASS 7
  // =========================================================================
  // Sanskrit: Deepakam (gsde1, 15 chs)
  {
    name: 'Class 7 Sanskrit (Deepakam)',
    code: 'gsde1',
    start: 1,
    end: 15,
    folders: ['class-7/sanskrit']
  },
  // English: Honeycomb (gehc1, 8 chs) & Alien Hand (geah1, 8 chs) & Poorvi (gepr1, 5 chs)
  {
    name: 'Class 7 English (Honeycomb)',
    code: 'gehc1',
    start: 1,
    end: 8,
    folders: ['class-7/english']
  },
  {
    name: 'Class 7 English (An Alien Hand)',
    code: 'geah1',
    start: 1,
    end: 8,
    folders: ['class-7/english/alien-hand']
  },
  {
    name: 'Class 7 English (Poorvi)',
    code: 'gepr1',
    start: 1,
    end: 5,
    folders: ['class-7/english/poorvi']
  },

  // =========================================================================
  // PRIORITY 5: CLASS 11
  // =========================================================================
  // Science: Physics Part 2 (keph2, 6 chs)
  {
    name: 'Class 11 Physics Part 2',
    code: 'keph2',
    start: 1,
    end: 6,
    folders: ['class-11/science/physics-part2']
  },
  // Science: Chemistry Part 1 (kech1, 6 chs) & Part 2 (kech2, 6 chs)
  {
    name: 'Class 11 Chemistry Part 1',
    code: 'kech1',
    start: 1,
    end: 6,
    folders: ['class-11/science/chemistry']
  },
  {
    name: 'Class 11 Chemistry Part 2',
    code: 'kech2',
    start: 1,
    end: 6,
    folders: ['class-11/science/chemistry-part2']
  },
  // Science: Biology (kebo1, 19 chs)
  {
    name: 'Class 11 Biology',
    code: 'kebo1',
    start: 1,
    end: 19,
    folders: ['class-11/science/biology']
  },
  // Social Science: Geography 1 & 2
  {
    name: 'Class 11 Geography (Physical Environment)',
    code: 'kegy1',
    start: 1,
    end: 6,
    folders: ['class-11/social-science/geography']
  },
  {
    name: 'Class 11 Geography (Fundamentals)',
    code: 'kegy2',
    start: 1,
    end: 14,
    folders: ['class-11/social-science/geography-fundamentals']
  },
  // Social Science: Political Science 1 & 2
  {
    name: 'Class 11 Political Science (Theory)',
    code: 'keps1',
    start: 1,
    end: 8,
    folders: ['class-11/social-science/political-science']
  },
  {
    name: 'Class 11 Political Science (Constitution)',
    code: 'keps2',
    start: 1,
    end: 10,
    folders: ['class-11/social-science/constitution']
  },
  // Social Science: Economics & Stats
  {
    name: 'Class 11 Economics (Indian Economic Dev)',
    code: 'keec1',
    start: 1,
    end: 8,
    folders: ['class-11/social-science/economics']
  },
  {
    name: 'Class 11 Economics (Statistics)',
    code: 'kest1',
    start: 1,
    end: 8,
    folders: ['class-11/social-science/statistics']
  },
  // Hindi: Aroh (khar1, 16 chs) & Vitan (khvt1, 5 chs)
  {
    name: 'Class 11 Hindi (Aroh)',
    code: 'khar1',
    start: 1,
    end: 16,
    folders: ['class-11/hindi/aroh']
  },
  {
    name: 'Class 11 Hindi (Vitan)',
    code: 'khvt1',
    start: 1,
    end: 5,
    folders: ['class-11/hindi/vitan']
  },
  // Sanskrit: Bhaswati (khsk1, 11 chs) & Shashwati (khsk2, 11 chs)
  {
    name: 'Class 11 Sanskrit (Bhaswati)',
    code: 'khsk1',
    start: 1,
    end: 11,
    folders: ['class-11/sanskrit']
  },
  {
    name: 'Class 11 Sanskrit (Shashwati)',
    code: 'khsk2',
    start: 1,
    end: 11,
    folders: ['class-11/sanskrit/shashwati']
  },
  // English: Hornbill (kehb1, 14 chs) & Snapshots (kesp1, 5 chs)
  {
    name: 'Class 11 English (Hornbill)',
    code: 'kehb1',
    start: 1,
    end: 14,
    folders: ['class-11/english']
  },
  {
    name: 'Class 11 English (Snapshots)',
    code: 'kesp1',
    start: 1,
    end: 5,
    folders: ['class-11/english/snapshots']
  },

  // =========================================================================
  // PRIORITY 6: CLASS 12
  // =========================================================================
  // Science: Physics Part 2 (leph2, 6 chs)
  {
    name: 'Class 12 Physics Part 2',
    code: 'leph2',
    start: 1,
    end: 6,
    folders: ['class-12/science/physics-part2']
  },
  // Science: Chemistry Part 1 & 2
  {
    name: 'Class 12 Chemistry Part 1',
    code: 'lech1',
    start: 1,
    end: 5,
    folders: ['class-12/science/chemistry']
  },
  {
    name: 'Class 12 Chemistry Part 2',
    code: 'lech2',
    start: 1,
    end: 5,
    folders: ['class-12/science/chemistry-part2']
  },
  // Science: Biology (lebo1, 13 chs)
  {
    name: 'Class 12 Biology',
    code: 'lebo1',
    start: 1,
    end: 13,
    folders: ['class-12/science/biology']
  },
  // Mathematics: Part 2 (lemh2, 7 chs)
  {
    name: 'Class 12 Maths Part 2',
    code: 'lemh2',
    start: 1,
    end: 7,
    folders: ['class-12/maths/part-2']
  },
  // Social Science: History Parts 2 & 3
  {
    name: 'Class 12 History Part 2',
    code: 'lehs2',
    start: 1,
    end: 4,
    folders: ['class-12/social-science/history-2']
  },
  {
    name: 'Class 12 History Part 3',
    code: 'lehs3',
    start: 1,
    end: 4,
    folders: ['class-12/social-science/history-3']
  },
  // Social Science: Geography 1 & 2
  {
    name: 'Class 12 Geography (Human Geography)',
    code: 'legy1',
    start: 1,
    end: 8,
    folders: ['class-12/social-science/geography']
  },
  {
    name: 'Class 12 Geography (People & Economy)',
    code: 'legy2',
    start: 1,
    end: 9,
    folders: ['class-12/social-science/geography-economy']
  },
  // Social Science: Political Science 1 & 2
  {
    name: 'Class 12 Political Science (World Politics)',
    code: 'leps1',
    start: 1,
    end: 7,
    folders: ['class-12/social-science/political-science']
  },
  {
    name: 'Class 12 Political Science (India)',
    code: 'leps2',
    start: 1,
    end: 8,
    folders: ['class-12/social-science/politics-in-india']
  },
  // Social Science: Economics 1 & 2
  {
    name: 'Class 12 Economics (Macroeconomics)',
    code: 'leec1',
    start: 1,
    end: 6,
    folders: ['class-12/social-science/economics']
  },
  {
    name: 'Class 12 Economics (Microeconomics)',
    code: 'leec2',
    start: 1,
    end: 5,
    folders: ['class-12/social-science/microeconomics']
  },
  // Hindi: Aroh (lhar1, 15 chs) & Vitan (lhvt1, 3 chs)
  {
    name: 'Class 12 Hindi (Aroh)',
    code: 'lhar1',
    start: 1,
    end: 15,
    folders: ['class-12/hindi/aroh']
  },
  {
    name: 'Class 12 Hindi (Vitan)',
    code: 'lhvt1',
    start: 1,
    end: 3,
    folders: ['class-12/hindi/vitan']
  },
  // Sanskrit: Bhaswati (lhsk1, 10 chs) & Shashwati (lhsk2, 11 chs)
  {
    name: 'Class 12 Sanskrit (Bhaswati)',
    code: 'lhsk1',
    start: 1,
    end: 10,
    folders: ['class-12/sanskrit']
  },
  {
    name: 'Class 12 Sanskrit (Shashwati)',
    code: 'lhsk2',
    start: 1,
    end: 11,
    folders: ['class-12/sanskrit/shashwati']
  },
  // English: Flamingo (lefl1, 13 chs) & Vistas (levt1, 6 chs)
  {
    name: 'Class 12 English (Flamingo)',
    code: 'lefl1',
    start: 1,
    end: 13,
    folders: ['class-12/english']
  },
  {
    name: 'Class 12 English (Vistas)',
    code: 'levt1',
    start: 1,
    end: 6,
    folders: ['class-12/english/vistas']
  }
];

// Helper: Save buffer to all target directories
function saveFile(relDir, fileName, buffer) {
  const p1 = path.join(USER_CHAPTERS_DIR, relDir, fileName);
  const p2 = path.join(APP_BOOKS_DIR, relDir, fileName);

  fs.mkdirSync(path.dirname(p1), { recursive: true });
  fs.writeFileSync(p1, buffer);

  fs.mkdirSync(path.dirname(p2), { recursive: true });
  fs.writeFileSync(p2, buffer);
}

// Helper: Check if already present on disk (either location)
function findExisting(relDir, fileName) {
  const p1 = path.join(USER_CHAPTERS_DIR, relDir, fileName);
  if (fs.existsSync(p1) && fs.statSync(p1).size > 1000) {
    return fs.readFileSync(p1);
  }
  const p2 = path.join(APP_BOOKS_DIR, relDir, fileName);
  if (fs.existsSync(p2) && fs.statSync(p2).size > 1000) {
    return fs.readFileSync(p2);
  }
  return null;
}

async function run() {
  console.log('='.repeat(75));
  console.log('DIVYAVANI MASTER NCERT CHAPTER DOWNLOADER');
  console.log('Destination 1: ' + USER_CHAPTERS_DIR);
  console.log('Destination 2: ' + APP_BOOKS_DIR);
  console.log('='.repeat(75));

  let fresh = 0;
  let cached = 0;
  let failed = 0;

  for (const track of DOWNLOAD_TRACKS) {
    console.log(`\n▶️ [${track.name}] (${track.code}) Ch ${track.start}..${track.end}`);

    for (let ch = track.start; ch <= track.end; ch++) {
      const chFormatted = String(ch).padStart(2, '0');
      const fileName = `ch-${chFormatted}.pdf`;

      // Check if primary folder already has it
      const existingBuf = findExisting(track.folders[0], fileName);
      if (existingBuf) {
        // Ensure all target folders have it
        for (const f of track.folders) {
          saveFile(f, fileName, existingBuf);
        }
        cached++;
        continue;
      }

      // Fetch from NCERT
      const url = `https://ncert.nic.in/textbook/pdf/${track.code}${chFormatted}.pdf`;
      const buf = await fetchPdfBuffer(url);

      if (buf) {
        for (const f of track.folders) {
          saveFile(f, fileName, buf);
        }
        // Also save in raw code naming if applicable
        const rawName = `${track.code}${chFormatted}.pdf`;
        saveFile(track.folders[0], rawName, buf);

        fresh++;
        const kb = (buf.length / 1024).toFixed(1);
        console.log(`  ✅ [200 OK] Ch ${chFormatted} (${kb} KB) -> ${track.folders[0]}/${fileName}`);
      } else {
        failed++;
        console.log(`  ⚠️  [404 / Skip] Ch ${chFormatted} (${track.code}${chFormatted}.pdf)`);
      }

      await sleep(150);
    }
  }

  console.log('\n' + '='.repeat(75));
  console.log('🎉 DOWNLOAD COMPLETE!');
  console.log(`Freshly Downloaded: ${fresh}`);
  console.log(`Already Present:    ${cached}`);
  console.log(`Unavailable/404:    ${failed}`);
  console.log('='.repeat(75));
}

await run();
