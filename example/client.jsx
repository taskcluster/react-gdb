/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import ExecClient from 'docker-exec-websocket-server/browser'
import ReactGDB from 'react-gdb'

let example = 'tickets'

let client = new ExecClient({
  url: 'ws://localhost:9090/docker-exec',
  command: ['gdb', '-i=mi', '--tty=/dev/null', `--cd=/examples/${example}`, 'main'],
  tty: false
})

let sourceProvider = {
  // It's a Python RegExp.
  filter: `^/examples/${example}`,
  fetch: async (filename) => {
    let base = 'https://raw.githubusercontent.com/taskcluster/gdb-examples/master'
    let res = await fetch(base + filename)
    if (!res.ok) throw new Error('Not a project file!')
    return await res.text()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  client.execute().then(() => {
    let reactGDB = <ReactGDB process={client} attachOnFork={true}
      sourceProvider={sourceProvider} objfileFilter={/^\/examples/} />
    render(reactGDB, document.getElementById('gdb'))
  })
})

window.localStorage.setItem('debug', 'gdb-js:*,react-gdb:*')

