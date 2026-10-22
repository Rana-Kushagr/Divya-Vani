// scripts/download_all_ncert.mjs
// Automated NCERT Textbook Downloader (Classes 6-12, 5 Core Subjects, Chapters 1-16)
import fs from 'node:fs';
import path from 'node:path';

const NCERT_BOOK_CODES = {
  'class-6': {
    science: 'fesc1',
    maths: 'femh1',
    'social-science': 'fess1',
    hindi: 'fhvs1',
    sanskrit: 'fssk1'
  },
  'class-7': {
    science: 'gesc1',
    maths: 'gemh1',
    'social-science': 'gess1',
    hindi: 'ghvs1',
    sanskrit: 'gssk1'
  },
  'class-8': {
    science: 'hesc1',
    maths: 'hemh1',
    'social-science': 'hess1',
    hindi: 'hhvs1',
    sanskrit: 'hssk1'
  },
  'class-9': {
    science: 'iesc1',
    maths: 'iemh1',
    'social-science': 'iehs1',
    hindi: 'ihks1',
    sanskrit: 'ihsh1'
  },
  'class-10': {
    science: 'jesc1',
    maths: 'jemh1',
    'social-science': 'jehs1',
    hindi: 'jhks1',
    sanskrit: 'jhsh1'
  },
  'class-11': {
    science: 'keph1',
    maths: 'kemh1',
    'social-science': 'kehs1',
    hindi: 'khat1',
    sanskrit: 'kssk1'
  },
  'class-12': {
    science: 'leph1',
    maths: 'lemh1',
    'social-science': 'lehs1',
    hindi: 'lhat1',
    sanskrit: 'lssk1'
  }
};

// Verified alternative NCERT rationalized book codes if primary returns 404
const FALLBACK_CODES = {
  'class-8': { 'social-science': 'hess2' },
  'class-9': { 'social-science': 'iess3' },
  'class-10': { 'social-science': 'jess1' },
  'class-12': { hindi: 'lhar1' }
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/pdf,*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'close'
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPdfBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) {
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate that the buffer is an authentic PDF (starts with %PDF)
    if (buffer.length < 500 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
      return null;
    }
    return buffer;
  } catch {
    return null;
  }
}

function syncAliases() {
  // No-op: Canonical folder structure public/books/<class>/<subject>/ch-<01-16>.pdf
}

async function run() {
  console.log('='.repeat(70));
  console.log('🏛️  DIVYAVANI OFFICIAL NCERT TEXTBOOK AUTOMATED DOWNLOAD ENGINE');
  console.log('='.repeat(70));
  console.log('Classes: 6 to 12 | Subjects: Science, Maths, SST, Hindi, Sanskrit');
  console.log('Chapters: 1 through 16 | Target: public/books/<class>/<subject>/ch-<num>.pdf\n');

  let downloadedCount = 0;
  let alreadyExistsCount = 0;
  let notFoundCount = 0;

  for (const [clsSlug, subjects] of Object.entries(NCERT_BOOK_CODES)) {
    console.log(`\n📚 Processing [${clsSlug.toUpperCase()}]...`);

    for (const [subjectSlug, primaryBookCode] of Object.entries(subjects)) {
      const targetDir = path.join('public', 'books', clsSlug, subjectSlug);
      fs.mkdirSync(targetDir, { recursive: true });

      const fallbackCode = FALLBACK_CODES[clsSlug]?.[subjectSlug];

      for (let ch = 1; ch <= 16; ch++) {
        const ch2Digit = String(ch).padStart(2, '0');
        const fileName = `ch-${ch2Digit}.pdf`;
        const destFile = path.join(targetDir, fileName);

        // Check if already downloaded and valid
        if (fs.existsSync(destFile)) {
          const stats = fs.statSync(destFile);
          if (stats.size > 1000) {
            alreadyExistsCount++;
            syncAliases(destFile, clsSlug, subjectSlug, ch, ch2Digit);
            continue;
          }
        }

        // Try primary book code first
        const primaryUrl = `https://ncert.nic.in/textbook/pdf/${primaryBookCode}${ch2Digit}.pdf`;
        let pdfBuffer = await fetchPdfBuffer(primaryUrl);
        let usedUrl = primaryUrl;

        // If primary returns 404, check fallback code if available
        if (!pdfBuffer && fallbackCode) {
          const fallbackUrl = `https://ncert.nic.in/textbook/pdf/${fallbackCode}${ch2Digit}.pdf`;
          pdfBuffer = await fetchPdfBuffer(fallbackUrl);
          if (pdfBuffer) {
            usedUrl = fallbackUrl;
          }
        }

        if (pdfBuffer) {
          fs.writeFileSync(destFile, pdfBuffer);
          syncAliases(destFile, clsSlug, subjectSlug, ch, ch2Digit);
          downloadedCount++;
          const sizeKb = (pdfBuffer.length / 1024).toFixed(1);
          console.log(`  ✅ [200 OK] ${clsSlug}/${subjectSlug}/ch-${ch2Digit}.pdf (${sizeKb} KB) <- ${usedUrl}`);
        } else {
          notFoundCount++;
          console.log(`  ⚠️  [404 Not Found] ${clsSlug}/${subjectSlug} Ch ${ch2Digit} (${primaryBookCode}${ch2Digit}.pdf)`);
        }

        // 200ms delay between requests to prevent rate limiting
        await sleep(200);
      }
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 NCERT PDF DOWNLOAD COMPLETED');
  console.log(`- Freshly Downloaded: ${downloadedCount}`);
  console.log(`- Already Cached:     ${alreadyExistsCount}`);
  console.log(`- Not Found / 404:    ${notFoundCount}`);
  console.log('='.repeat(70));
}

await run();
