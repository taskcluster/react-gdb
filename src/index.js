import ExecClient from 'ws-exec/browser'
import querystring from 'querystring'

let url = 'ws://localhost:8081/demo?' +
  querystring.stringify({ tty: true, command: ['gdb', './guess-game/main'] })
let client = new ExecClient(url)

client.stdout.on('data', (chunk) => console.log(chunk.toString()))
client.stderr.on('data', (chunk) => console.log(chunk.toString()))
client.on('exit', (exitCode) => console.log(exitCode))

window.cmd = (str) => { client.stdin.write(str+"\n") }
