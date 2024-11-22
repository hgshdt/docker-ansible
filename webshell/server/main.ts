import http from 'node:http';
import express from 'express';
import * as nodePty from 'node-pty';
import WebSocket from 'ws';

const app = express();
const server = new http.Server(app);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

const staticDir = './build';
app.use('/', express.static(staticDir));
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const pty = nodePty.spawn('bash', ['--login'], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
  });

  pty.onData((data) => {
    ws.send(JSON.stringify({ output: data }));
  });

  ws.on('message', (message) => {
    const m = JSON.parse(message.toString());

    if (m.input) {
      pty.write(m.input);
    } else if (m.resize) {
      pty.resize(m.resize[0], m.resize[1]);
    }
  });
});

server.listen(Number(process.env.PORT) || 8999, '0.0.0.0', () => {
  console.log(`Server started on ${JSON.stringify(server.address())} :)`);
});
