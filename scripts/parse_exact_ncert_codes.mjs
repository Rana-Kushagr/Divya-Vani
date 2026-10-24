// scripts/parse_exact_ncert_codes.mjs
import fs from 'node:fs';

async function run() {
  console.log('Fetching https://ncert.nic.in/textbook.php...');
  const res = await fetch('https://ncert.nic.in/textbook.php', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  console.log('Fetched HTML length:', html.length);

  // Match all if/else conditions for class 6 to 12
  // e.g. document.test.tclass.value==6 && document.test.tsubject.options[sind].text=="Science"
  // document.test.tbook.options[1].text="Curiosity"
  // document.test.tbook.options[1].value="textbook.php?fscu1=0-12"

  const blockRegex = /if\s*\(\s*\(document\.test\.tclass\.value==(\d+)\)\s*&&\s*\(document\.test\.tsubject\.options\[sind\]\.text==["']([^"']+)["']\)\s*\)([\s\S]*?)(?=else if|\/\/\s*this condition|$)/gi;
  
  const results = {};

  let match;
  while ((match = blockRegex.exec(html)) !== null) {
    const classNum = parseInt(match[1], 10);
    if (classNum < 6 || classNum > 12) continue;
    const subjectName = match[2].trim();
    const body = match[3];

    const bookMatches = [...body.matchAll(/options\[\d+\]\.text=["']([^"']+)["'][\s\S]*?options\[\d+\]\.value=["']textbook\.php\?([a-z0-9]+)=(\d+)-(\d+)["']/gi)];
    
    if (!results[`class-${classNum}`]) results[`class-${classNum}`] = {};
    if (!results[`class-${classNum}`][subjectName]) results[`class-${classNum}`][subjectName] = [];

    for (const bm of bookMatches) {
      results[`class-${classNum}`][subjectName].push({
        title: bm[1],
        code: bm[2],
        start: parseInt(bm[3], 10),
        end: parseInt(bm[4], 10)
      });
    }
  }

  console.log('Extracted exact book catalog for Classes 6-12:');
  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('scripts/official_ncert_matrix.json', JSON.stringify(results, null, 2));
}

run();
