/**
 * test-server.js — Servidor HTTP mínimo para pruebas de conectividad.
 *
 * Crea un servidor HTTP básico con Node.js (sin Express) que responde
 * JSON en cualquier ruta. Usado para verificar que el servidor está
 * accesible desde la red local (ej. curl http://192.168.1.2:3001/).
 *
 * Puerto: 3001.
 * Uso: node test-server.js
 */

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Simple server works!', path: req.url }));
});

server.listen(3001, () => {
  console.log('Simple test server running on port 3001');
  console.log('Test it with: curl http://192.168.1.2:3001/');
});
