/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import ExecClient from 'docker-exec-websocket-server/browser'
import ReactGDB from 'react-gdb'

let client = new ExecClient({
  url: 'ws://localhost:9090/docker-exec',
  command: ['gdb', '-i=mi', '-tty=/dev/null', 'tickets/main'],
  tty: false
})

let sourceProvider = {
  basePath: '/examples/tickets',
  fetch: async (filename) => {
    try {
      let base = 'https://raw.githubusercontent.com/baygeldin/gdb-examples/master'
      let res = await fetch(base + filename)
      return await res.text()
    } catch (e) {
      throw new Error('Not a project file!')
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // XXX: For reasons unknown, stdin, stdout and stderr are
  // not set in the constructor, but in the async function.
  // TODO: Send a PR.
  client.execute().then(() => {
    render(<ReactGDB process={client} sourceProvider={sourceProvider} />,
      document.getElementById('gdb'))
  })
})

window.localStorage.setItem('debug', 'gdb-js:*,react-gdb:*')

