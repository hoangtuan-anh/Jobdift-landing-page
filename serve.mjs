import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// ── API mock (mirrors api/subscribe.php behaviour for local dev) ──
function handleSubscribe(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let email = '';
    try {
      email = JSON.parse(body).email || '';
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid request body.' }));
      return;
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    if (!valid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Please enter a valid email address.' }));
      return;
    }

    // Append to subscribers.csv alongside the PHP file
    const file = path.join(__dirname, 'api', 'subscribers.csv');
    const row = `${email.trim()},${new Date().toISOString()}\n`;
    fs.appendFileSync(file, row);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Subscribed successfully.' }));
  });
}

// ── Static file server ──
http.createServer((req, res) => {
  // Route API calls to the mock handler
  if (req.url === '/api/subscribe.php' && req.method === 'POST') {
    return handleSubscribe(req, res);
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : decodeURIComponent(req.url));

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
