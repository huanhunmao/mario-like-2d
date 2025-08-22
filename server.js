import http from 'http';
import { createReadStream, statSync, existsSync } from 'fs';
import { extname, join, resolve } from 'path';
import url from 'url';

const port = process.env.PORT || 5173;
const root = resolve('./');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url).pathname || '/';
  let filePath = join(root, parsed);
  if (parsed.endsWith('/')) filePath = join(root, 'index.html');
  if (!existsSync(filePath)) {
    // try index.html for client-side routes
    if (existsSync(join(root, 'index.html'))) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return createReadStream(join(root, 'index.html')).pipe(res);
    }
    res.writeHead(404);
    return res.end('404 Not Found');
  }
  const type = types[extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
  console.log(`> Local dev server running at http://localhost:${port}`);
});
