import http from 'http'
import { DockerExecServer } from 'docker-exec-websocket-server'

const PORT = process.env.PORT || 9090

export default new DockerExecServer({
  path: '/docker-exec',
  server: http.createServer().listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
  }),
  containerId: 'react-gdb'
})
