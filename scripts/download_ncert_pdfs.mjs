// scripts/download_ncert_pdfs.mjs
// Run via: node scripts/download_ncert_pdfs.mjs
import fs from 'fs';
import path from 'path';
import https from 'https';

const NCERT_BOOK_CODES = {
  'class-6':  { science: 'fesc1', mathematics: 'femh1', 'social-science': 'fess1', english: 'fehl1', hindi: 'fhvs1', sanskrit: 'fssk1' },
  'class-7':  { science: 'gesc1', mathematics: 'gemh1', 'social-science': 'gess1', english: 'gehc1', hindi: 'ghvs1', sanskrit: 'gssk1' },
  'class-8':  { science: 'hesc1', mathematics: 'hemh1', 'social-science': 'hess2', english: 'hehd1', hindi: 'hhvs1', sanskrit: 'hssk1' },
  'class-9':  { science: 'iesc1', mathematics: 'iemh1', 'social-science': 'iess3', english: 'iebe1', hindi: 'ihks1', sanskrit: 'ihsh1' },
  'class-10': { science: 'jesc1', mathematics: 'jemh1', 'social-science': 'jess3', english: 'jeff1', hindi: 'jhks1', sanskrit: 'jhsh1' },
  'class-11': { science: 'keph1', mathematics: 'kemh1', 'social-science': 'kehs1', english: 'keho1', hindi: 'khat1', sanskrit: 'kssk1' },
  'class-12': { science: 'leph1', mathematics: 'lemh1', 'social-science': 'lehs1', english: 'lefl1', hindi: 'lhar1', sanskrit: 'lssk1' }
};

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    // Check if already downloaded
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve(true);
    }

    const file = fs.createWriteStream(destPath);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    });

    req.on('error', () => {
      file.close();
      fs.unlink(destPath, () => {});
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      resolve(false);
    });
  });
}

async function run() {
  console.log('Starting automated NCERT PDF Downloader...');
  // Download key priority chapters first to keep build light and fast
  const priorityClasses = ['class-9', 'class-10'];
  
  for (const [clsSlug, subjects] of Object.entries(NCERT_BOOK_CODES)) {
    if (!priorityClasses.includes(clsSlug)) continue; // priority download
    for (const [subSlug, bookCode] of Object.entries(subjects)) {
      for (let ch = 1; ch <= 3; ch++) {
        const chCode = ch < 10 ? `0${ch}` : `${ch}`;
        const officialUrl = `https://ncert.nic.in/textbook/pdf/${bookCode}${chCode}.pdf`;
        const localPath = path.join('public', 'ncert-pdfs', clsSlug, subSlug, `${bookCode}${chCode}.pdf`);
        console.log(`Downloading ${officialUrl} -> ${localPath}`);
        await downloadFile(officialUrl, localPath);
      }
    }
  }
  console.log('Automated NCERT PDF sync completed!');
}

run();
