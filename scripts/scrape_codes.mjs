// scripts/scrape_codes.mjs
async function run() {
  try {
    const res = await fetch('https://ncert.nic.in/textbook.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    console.log('HTML Length:', html.length);
    
    // Search for JavaScript data arrays or option values in the HTML
    const regex = /["']([f-l][a-z0-9]{3,4})["']/gi;
    const codes = new Set();
    let m;
    while ((m = regex.exec(html)) !== null) {
      codes.add(m[1].toLowerCase());
    }
    console.log('Found potential book codes:', Array.from(codes).slice(0, 100));

    // Also look for external scripts like textbook.js or dependent dropdown scripts
    const scriptMatches = [...html.matchAll(/src=["']([^"']+\.js[^"']*)["']/gi)];
    console.log('Scripts included:', scriptMatches.map(s => s[1]));
  } catch (err) {
    console.error('Error scraping:', err);
  }
}
run();
