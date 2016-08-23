/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import ExecClient from 'docker-exec-websocket-server/browser'
import ReactGDB from 'react-gdb'

// Any example from `gdb-examples` repo.
let example = 'hackathon'

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
    client.stdout.on('data', (data) => console.log(data.toString()))
    let reactGDB = <ReactGDB process={client} attachOnFork
      sourceProvider={sourceProvider} objfileFilter={/^\/examples/} />
    render(reactGDB, document.getElementById('gdb'))
  })
})

window.localStorage.setItem('debug', 'gdb-js:*,react-gdb:*')

