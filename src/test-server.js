let ws = require('ws');
let wsStream = require('websocket-stream');
let child_process = require('child_process');
let path = require('path');

let server = new ws.Server({port: 8080});

server.on('connection', socket => {
  let stream = wsStream(socket);

  let gdb = child_process.spawn('gdb', ['-q', '--interpreter=mi', './hello'], {
    cwd: path.join(__dirname, '..'),
    stdio: ['pipe', 'pipe', 'ignore'], // TODO: Maybe not ignore stderr
    detached: false,
  });

  // TODO: We probably have to do some multiplexing... So that we can send
  // stderr to the client two. I don't mean two websockets. I mean sending two
  // streams over the same socket, and then splitting the two streams on the
  // other side.
  gdb.stdout.pipe(stream);
  stream.pipe(gdb.stdin);
});