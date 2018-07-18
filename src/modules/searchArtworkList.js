import { datastore } from '../services/database'

const RESULTS_PER_PAGE = 15

/**
 * 작품을 검색합니다. 한 번에 최대 15개의 결과를 보여줄 수 있습니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.query.query 검색어입니다.
 * @param {String} request.query.type 검색에 활용할 정보입니다.
 * @param {String} request.query.cursor 목록의 첫 아이템의 위치입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const { type, query: value } = request.query
  let query = datastore.createQuery('Artwork').limit(RESULTS_PER_PAGE)

  switch (type) {
    case 'id':
      query = query.filter(type, '>=', parseInt(value))
      break
    case 'artist':
    case 'title':
      query = query.filter(type, '>=', value)
      break
    case 'tags':
      query = query.filter(type, '=', value).order('id', { descending: true })
      break
  }

  if (request.query.cursor) {
    query.start(request.query.cursor)
  }

  try {
    const [artworks, info] = await datastore.runQuery(query)
    response.status(200).send({
      artworks,
      cursor: info.moreResults !== datastore.NO_MORE_RESULTS ? info.endCursor : null,
    })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
