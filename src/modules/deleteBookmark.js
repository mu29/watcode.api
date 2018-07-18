import { datastore, find } from '../services/database'
import { updateCounter, updatePopularity } from '../helpers'

/**
 * 작품을 즐겨찾기에서 삭제합니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /bookmarks/{id} 의 형태로 이루어져야 합니다.
 * @param {Object} request.header.Authorization 사용자의 고유한 ID입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /bookmarks\/(\d+)/
  const id = parseInt(request.url.match(pathRegex)[1])
  const userId = request.get('Authorization')

  if (!userId) {
    response.status(401).end()
  }

  try {
    const bookmark = await find('Bookmark', 'artworkId', id)
    const key = datastore.key(['Bookmark', bookmark.id])
    await Promise.all([
      datastore.delete(key),
      updateCounter(id, 'bookmarks', -1),
      updatePopularity(id, -20),
    ])
    const artworkKey = datastore.key(['Artwork', id])
    const [artwork = {}] = await datastore.get(artworkKey)
    response.status(201).send(artwork)
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
