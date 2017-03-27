require('dotenv').config()

import request from 'request-promise'
import htmlToText from 'html-to-text'
import iconv from 'iconv-lite'

const debug = require('debug')('legendas-divx:libs')

const { USER_AGENT, LD_DOWNLOAD_URL, LD_SEARCH_URL, LD_PER_PAGE } = process.env

const LegendasDivx = (function () {
  /* private methods */
  const _getTotalPages = (data) => {
    const regex = /[^]+?\s\((.*)\sencontradas/ig

    const m = regex.exec(data)

    m.splice(0, 1)

    const [ totalPages ] = m.map(_ => _)

    return parseInt(totalPages)
  }

  const _getSubtitles = (data) => {
    const regex = /<div\sclass="sub_box">\n<div\sclass="sub_header">\n<b>(.*?)<\/b>\s\((.*?)\).*><b>(.*?)<.*em\s(.*|\d?)\s-.*<\/b>\s(.*?)\s[^]+?\/(.*?)\.[^]+?Frame\sRate:<\/th>\n<td>(.*?)&[^]+?Hits:<\/th>\n<td>(.*?)<[^]+?Origem:<\/th>\n<td>(.*)&[^]+?brd_up">([^]*?)<\/td>[^]+?getit&lid=(.*)"/gim

    const subtitles = []
    let m

    while ((m = regex.exec(data)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) regex.lastIndex++

      m.splice(0, 1)
      const [
        title,
        year,
        uploadedBy,
        uploadedAt,
        type,
        lang,
        frameRate,
        hits,
        origin,
        descriptionInHTML,
        id
      ] = m.map((match, groupIndex) => match)

      const description = htmlToText.fromString(
        descriptionInHTML,
        { wordwrap: 130 }).toString('utf8'
      )

      const language = lang.split('/').pop()

      const subtitle = {
        id: parseInt(id),
        title,
        year: parseInt(year),
        uploadedBy,
        uploadedAt,
        type,
        language,
        frameRate: frameRate ? parseFloat(frameRate) : null,
        hits: parseInt(hits),
        origin: origin.toString('utf8'),
        description,
        download: `${LD_DOWNLOAD_URL}${id}`
      }

      subtitles.push(subtitle)
    }

    return subtitles
  }

  /* public methods */
  const search = async (query, page, order = 'date desc') => {
    var options = {
      method: 'POST',
      uri: encodeURI(`${LD_SEARCH_URL}&order=${order}&page=${page}`),
      encoding: null,
      form: { query },
      headers: { 'User-Agent': USER_AGENT },
      transform: (body, response) => {
        // set right text encoding
        return iconv.decode(body, 'ISO-8859-15').toString()
      }
    }

    try {
      const result = await request(options)

      const subtitles = _getSubtitles(result)
      const total = _getTotalPages(result)
      const pages = Math.ceil(total / LD_PER_PAGE)

      return { subtitles, total, pages }
    } catch (error) {
      debug(error)
    }
  }

  return {
    search
  }
})()

export default LegendasDivx
