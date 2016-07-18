import http from 'http'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import { DockerExecServer } from 'docker-exec-websocket-server'

const PORT = 8080

let app = new Koa()
let reactGDB = new Koa()

reactGDB.use(serve('lib/assets'))
app.use(serve('example/static'))
app.use(mount('/react-gdb', reactGDB))

let server = http.createServer(app.callback())
server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})

let dockerServer = new DockerExecServer({
  path: '/docker-exec',
  server: server,
  containerId: 'react-gdb'
})

export default dockerServer
