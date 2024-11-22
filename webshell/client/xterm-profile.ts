import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { SerializeAddon } from '@xterm/addon-serialize';
import { Unicode11Addon } from '@xterm/addon-unicode11';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal } from 'xterm';

const term = new Terminal({
  cols: 80,
  rows: 24,
  allowProposedApi: true,
});

term.open(document.getElementById('terminal') as HTMLInputElement);

const fitAddon = new FitAddon();
const searchAddon = new SearchAddon();
const webLinksAddon = new WebLinksAddon();
const unicode11Addon = new Unicode11Addon();
const serializeAddon = new SerializeAddon();

[fitAddon, searchAddon, webLinksAddon, unicode11Addon, serializeAddon].map(
  (e) => term.loadAddon(e),
);

const messageQueue: string[] = [];

const url = process.env.WS_URL || 'localhost';
const port = process.env.WS_PORT || '8999';

let ws: WebSocket;
let reconnectAttempts = 0;

const maxReconnectAttempts = 3;
const reconnectDelay = 3000;

function connectWebSocket() {
  ws = new WebSocket(`ws://${url}:${port}`);

  ws.addEventListener('open', () => {
    console.info('WebSocket connected');
    reconnectAttempts = 0;
    while (messageQueue.length > 0) {
      const message = messageQueue.shift();
      if (message !== undefined) ws.send(message);
    }
  });

  ws.addEventListener('close', () => {
    console.warn('WebSocket closed');
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      console.info(
        `Reconnecting in ${reconnectDelay / 1000} seconds... (${reconnectAttempts}/${maxReconnectAttempts})`,
      );
      setTimeout(connectWebSocket, reconnectDelay);
    } else {
      console.error('Max reconnect attempts reached. Connection failed.');
    }
  });

  ws.addEventListener('message', (event) => {
    try {
      const output = JSON.parse(event.data);
      term.write(output.output, () => {});
    } catch (e) {
      console.error(e);
    }
  });
}

function sendMessage(message: string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    messageQueue.push(message);
  }
}

term.onData((data) => {
  sendMessage(JSON.stringify({ input: data }));
});

window.addEventListener('resize', () => {
  fitAddon.fit();
});

term.onResize((size) => {
  const resizer = JSON.stringify({ resize: [size.cols, size.rows] });
  sendMessage(resizer);
});

connectWebSocket();
fitAddon.fit();
