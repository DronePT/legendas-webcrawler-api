import { Router } from 'express'
// const debug = require('debug')('legendas-divx:app')

import SearchController from './controller'

const searchRouter = (app) => {
  const router = Router()
  const controller = new SearchController(app)

  const ENDPOINT = '/search'

  router
    .route(ENDPOINT)
    .get(controller.main)

  return router
}

export default searchRouter
