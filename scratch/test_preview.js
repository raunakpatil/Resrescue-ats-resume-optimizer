const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.log(`[BROWSER ERROR]: ${err.message}`);
  });

  // assuming vite runs on 5173
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // wait 2 seconds
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
