import { Router } from 'express'

// modules routing
import { search } from './../modules'

const appRouter = (app) => {
  const router = Router()

  // ENDPOINT: /search
  router.use(search.router(app))

  // ENDPOINT: /events
  // router.use(events.router(app))

  router.use(
    '/',
    (req, res) => res.json({ name: 'Task Routing Tests' })
  )

  return router
}

export default appRouter
