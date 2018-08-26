import raccoon from 'raccoon'
import { datastore, exists } from '../services/database'
import { updateCounter, updatePopularity } from '../helpers'

/**
 * 작품을 즐겨찾기에 추가합니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{id}/bookmarks 의 형태로 이루어져야 합니다.
 * @param {Object} request.header.Authorization 사용자의 고유한 ID입니다.
 * @param {Object} request.body.email 사용자의 메일 주소입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/bookmarks/
  const id = parseInt(request.url.match(pathRegex)[1])
  const { email } = request.body
  const userId = request.get('Authorization')
  const key = datastore.key('Bookmark')
  const createdAt = new Date()

  if (!userId) {
    response.status(401).end()
    return
  }

  try {
    const hasBookmark = await exists('Bookmark', ['artworkId', id], ['userId', userId])
    const artworkKey = datastore.key(['Artwork', id])
    const [artwork = {}] = await datastore.get(artworkKey)
    if (!hasBookmark && Object.keys(artwork).length > 0) {
      await Promise.all([
        datastore.save({
          key,
          data: {
            artworkId: id,
            userId,
            email,
            createdAt,
          }
        }),
        raccoon.liked(userId, id),
        updateCounter(id, 'bookmarks', 1),
        updatePopularity(id, 20),
      ])
    }
    response.status(201).send(artwork)
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
