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

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on Modern template just in case
  // But wait, it might require uploading a resume first?
  // Ah! Step5_Results is only reachable if a resume is uploaded!
  // It won't render TemplateModern automatically if we just go to localhost:5173.
  
  await browser.close();
})();
