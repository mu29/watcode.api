import { datastore } from '../services/database'

const RESULTS_PER_PAGE = 100

/**
 * 작품의 댓글 목록을 불러옵니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{id}/comments 의 형태로 이루어져야 합니다.
 * @param {String} request.query.cursor 목록의 첫 아이템의 위치입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/comments/
  const artworkId = parseInt(request.url.match(pathRegex)[1])

  const query = datastore
    .createQuery('Comment')
    .filter('artworkId', artworkId)
    .order('createdAt')
    .limit(RESULTS_PER_PAGE)

  if (request.query.cursor) {
    query.start(request.query.cursor)
  }

  try {
    const [entities, info] = await datastore.runQuery(query)
    const comments = entities.map(entity => {
      delete entity.userId
      return {
        id: entity[datastore.KEY].id,
        ...entity,
      }
    })
    response.status(200).send({
      comments,
      cursor: info.moreResults !== datastore.NO_MORE_RESULTS ? info.endCursor : null,
    })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
