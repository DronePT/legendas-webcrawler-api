require('dotenv').config()
// const debug = require('debug')('legendas-divx:app')

import LegendasDivx from './../../libs/legendasdivx'

function SearchController (app) {
  const controller = {}

  controller.main = async (req, res) => {
    const { q, page } = req.query

    const currentPage = parseInt(page || 1)

    const { subtitles: data, total, pages } = await LegendasDivx.search(q || '', currentPage)

    const previousPage = currentPage > 1 ? currentPage - 1 : undefined
    const nextPage = currentPage < pages ? currentPage + 1 : undefined

    res.json({
      success: true,
      data,
      meta: {
        total,
        pages,
        currentPage,
        previousPage,
        nextPage
      }
    })
  }

  return controller
}

export default SearchController
