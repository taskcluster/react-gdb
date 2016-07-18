/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import ReactGDB from '../lib'
import ExecClient from 'docker-exec-websocket-server/browser'

let client = new ExecClient({
  url: 'ws://localhost:8080/docker-exec',
  command: ['gdb', '-i=mi', '-tty=/dev/null', 'tickets/main'],
  tty: false
})

async function getFile (filename) {
  if (filename.startsWith('/examples')) {
    let link = 'https://raw.githubusercontent.com/baygeldin/gdb-examples/master' + filename
    let res = await fetch(link)
    return await res.text()
  } else {
    throw new Error('Not a project file!')
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // XXX: For reasons unknown, stdin, stdout and stderr are
  // not set in the constructor, but in the async function.
  // TODO: Send a PR.
  client.execute().then(() => {
    render(<ReactGDB process={client} sourceProvider={getFile} />,
      document.getElementById('gdb'))
  })
})
