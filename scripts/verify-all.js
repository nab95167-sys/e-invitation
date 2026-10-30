const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const proc = spawn(chromePath, [
    '--headless',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,1000'
  ]);

  await new Promise(r => setTimeout(r, 2000));
  const targetUrl = 'http://localhost:3000/invite/raksmey-and-pheakdey?code=vip-guest-01';
  const newTab = await (await fetch('http://127.0.0.1:9225/json/new?' + targetUrl, { method: 'PUT' })).json();
  const ws = new WebSocket(newTab.webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });

  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const cur = id++;
    const h = (event) => {
      const d = JSON.parse(event.data);
      if (d.id === cur) {
        ws.removeEventListener('message', h);
        res(d.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  await new Promise(r => setTimeout(r, 3500));

  // Screenshot 1: Gate / Envelope
  const snap1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '01-gate-envelope.png'), Buffer.from(snap1.data, 'base64'));

  // Click seal to open envelope
  await send('Runtime.evaluate', {
    expression: `
      const seal = document.getElementById('seal') || document.querySelector('.e2__seal') || document.getElementById('env');
      if (seal) seal.click();
    `
  });

  // Wait for open transition
  await new Promise(r => setTimeout(r, 4500));

  // Screenshot 2: Hero
  const snap2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '02-hero.png'), Buffer.from(snap2.data, 'base64'));

  // Scroll to Words & Couple
  await send('Runtime.evaluate', { expression: 'document.getElementById("words").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1200));
  const snap3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '03-words-couple.png'), Buffer.from(snap3.data, 'base64'));

  // Scroll to Countdown & Programme
  await send('Runtime.evaluate', { expression: 'document.getElementById("countdown").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1200));
  const snap4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '04-countdown-programme.png'), Buffer.from(snap4.data, 'base64'));

  // Scroll to Story
  await send('Runtime.evaluate', { expression: 'document.getElementById("story").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1200));
  const snap5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '05-story.png'), Buffer.from(snap5.data, 'base64'));

  // Scroll to Gallery
  await send('Runtime.evaluate', { expression: 'document.getElementById("gallery").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1500));
  const snap6 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '06-gallery.png'), Buffer.from(snap6.data, 'base64'));

  // Scroll to Venue & Gift
  await send('Runtime.evaluate', { expression: 'document.getElementById("venue").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1200));
  const snap7 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '07-venue-gift.png'), Buffer.from(snap7.data, 'base64'));

  // Scroll to RSVP & Wishes
  await send('Runtime.evaluate', { expression: 'document.getElementById("rsvp").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1200));
  const snap8 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '08-rsvp-wishes.png'), Buffer.from(snap8.data, 'base64'));

  // Scroll to Finale / Footer
  await send('Runtime.evaluate', { expression: 'document.getElementById("finale").scrollIntoView({ behavior: "instant" });' });
  await new Promise(r => setTimeout(r, 1200));
  const snap9 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, '09-finale.png'), Buffer.from(snap9.data, 'base64'));

  console.log('All 9 screenshots captured successfully in screenshots/');
  ws.close();
  proc.kill();
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
