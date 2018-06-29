'use strict'

const datastore = require('@google-cloud/datastore')()
const RESULTS_PER_PAGE = 15

// [START artworks_recent_get]
/**
 * 최신 작품 목록을 보여줍니다. 한 번에 최대 15개의 결과를 보여줄 수 있습니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.query.cursor 목록의 첫 아이템의 위치입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
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
// [END artworks_recent_get]
