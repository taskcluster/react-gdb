import http from 'http'
import { DockerExecServer } from 'docker-exec-websocket-server'

const PORT = 8081

let server = http.createServer().listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

let dockerServer = new DockerExecServer({
  port: PORT,
  path: '/demo',
  server: server,
  containerId: 'gdb-examples'
})

export default dockerServer
