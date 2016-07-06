import { render } from 'react-dom'
import ReactGDB from '../lib'
import ExecClient from 'docker-exec-websocket-server/browser'

let client = new ExecClient({
  url: 'ws://localhost:8080/docker-exec',
  command: ['gdb', '-i=mi', '-tty=/dev/null', 'tickets/main']
})

async function getFile (filename) {
  // TODO: Git source provider
}

document.addEventListene('DOMContentLoaded', () => {
  render(
    <ReactGDB process={client} sourceProvider={getFile} />,
    document.getElementById('gdb')
  )
})
