import { datastore, find } from '../services/database'
import { updateCounter, updatePopularity } from '../helpers'

/**
 * 댓글을 삭제합니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /comments/{id} 의 형태로 이루어져야 합니다.
 * @param {Object} request.header.Authorization 사용자의 고유한 ID입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /comments\/(\d+)/
  const id = parseInt(request.url.match(pathRegex)[1])
  const userId = request.get('Authorization')
  const key = datastore.key(['Comment', id])
  const artworkId = parseInt(request.query.artworkId)

  if (!userId) {
    response.status(401).end()
    return
  }

  try {
    const [comment] = await datastore.get(key)
    if (!comment) {
      response.status(404).end()
      return
    }

    if (comment.userId !== userId) {
      response.status(401).end()
      return
    }

    await Promise.all([
      datastore.delete(key),
      updateCounter(artworkId, 'comments', -1),
      updatePopularity(artworkId, -10),
    ])
    response.status(200).send({ id })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
