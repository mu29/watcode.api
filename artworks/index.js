'use strict'

const datastore = require('@google-cloud/datastore')()
const RESULTS_PER_PAGE = 15

exports.recent = (request, response) => {
  const query = datastore
    .createQuery('Artwork')
    .order('code', { descending: true })
    .limit(RESULTS_PER_PAGE)

  if (request.query.cursor) {
    query.start(request.query.cursor)
  }

  datastore.runQuery(query, (err, entities, info) => {
    if (err) {
      response.status(422).send(err)
      return
    }

    response.status(200).send({
      artworks: entities,
      cursor: info.moreResults !== datastore.NO_MORE_RESULTS ? info.endCursor : null,
    })
  })
}
