const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Simple server works!', path: req.url }));
});

server.listen(3001, () => {
  console.log('Simple test server running on port 3001');
  console.log('Test it with: curl http://192.168.1.2:3001/');
});
