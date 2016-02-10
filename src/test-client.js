let ws = require('ws');
let wsStream = require('websocket-stream');

let socket = new ws('ws://localhost:8080');

socket.on('open', () => {
  let stream = wsStream(socket);
  stream.pipe(process.stdout);
  stream.write('run\n');
});

