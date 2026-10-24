// scripts/extract_catalog.mjs
import fs from 'node:fs';

async function run() {
  const res = await fetch('https://ncert.nic.in/textbook.php', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // Look for options with 4-5 letter value
  const regex = /<option[^>]*value=["']([a-zA-Z0-9]{4,6})["'][^>]*>([^<]+)<\/option>/gi;
  const map = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    const code = m[1].toLowerCase();
    const title = m[2].trim();
    map.push({ code, title });
  }

  console.log(`Found ${map.length} total options in textbook.php`);
  fs.writeFileSync('scripts/ncert_options.json', JSON.stringify(map, null, 2));

  // Filter for class 6, 7, 8, 9, 10, 11, 12 in the 6 subjects
  const classes = ['f', 'g', 'h', 'i', 'j', 'k', 'l'];
  const relevant = map.filter(item => classes.includes(item.code[0]));
  console.log(`Filtered ${relevant.length} books for classes 6 to 12.`);

  for (const item of relevant) {
    console.log(`${item.code} -> ${item.title}`);
  }
}
run();
