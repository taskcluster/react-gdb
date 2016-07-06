import http from 'http'
import koa from 'koa'
import serve from 'koa-static'
import { DockerExecServer } from 'docker-exec-websocket-server'

const PORT = 8080

let app = koa()

app.use(serve('./static'))
app.use(serve('../dist'))


let server = http.createServer(app.callback()).listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`)
})

let dockerServer = new DockerExecServer({
  path: '/docker-exec',
  server: server,
  containerId: 'baygeldin/gdb-examples'
})

export default dockerServer
