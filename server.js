require('dotenv').config()
const debug = require('debug')('legendas-divx:server')

import Application from './src/app'

const startServer = async () => {
  try {
    const app = await Application()

    const PORT = process.env.PORT || 1337

    const onListening = async () => {
      const addr = server.address()
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
      
      debug('Application listening on ' + bind)
    }

    const server = await app.listen(PORT)

    server.on('listening', onListening)
  } catch (err) {
    debug('Error starting application')
  }
}

startServer()