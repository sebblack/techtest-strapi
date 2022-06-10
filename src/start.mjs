import config from './config.mjs'
import { createServer } from './server.mjs'

const start = async () => {
  const app = await createServer()
  app.listen(config.server.port)
  console.log(`listening on http://${config.server.host}:${config.server.port}`)
}

start()