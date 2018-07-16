import { datastore } from '../services/database'

const RESULTS_PER_PAGE = 15

/**
 * 인기 작품 목록을 보여줍니다. 한 번에 최대 15개의 결과를 보여줄 수 있습니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.query.cursor 목록의 첫 아이템의 위치입니다.
 * @param {String} request.query.period 작품에 대한 반응을 집계할 기간입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const query = datastore
    .createQuery('Popularity')
    .order(request.query.period || 'daily', { descending: true })
    .limit(RESULTS_PER_PAGE)

  if (request.query.cursor) {
    query.start(request.query.cursor)
  }

  try {
    const [entities, info] = await datastore.runQuery(query)
    const ids = entities.map(e => e.id)
    const keys = ids.map(id => datastore.key(['Artwork', id]))
    const [artworks] = await datastore.get(keys)

    response.status(200).send({
      artworks: artworks.sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id)),
      cursor: info.moreResults !== datastore.NO_MORE_RESULTS ? info.endCursor : null,
    })
  } catch (error) {
    response.status(422).send(error)
  }
}
