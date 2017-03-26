require('dotenv').config()
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
// const debug = require('debug')('legendas-divx:app')

// libraries

// application
import appRouter from './router'

const Application = async () => {
  const app = express()

  // middlewares
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cors())
  app.use(helmet({
    hsts: process.env.NODE_ENV !== 'development'
  }))

  // routing configurations
  app.use(appRouter(app))

  return app
}

export default Application
