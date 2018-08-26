import raccoon from 'raccoon'
import { datastore, exists } from '../services/database'
import { updateCounter, updatePopularity } from '../helpers'

/**
 * 작품 목록을 즐겨찾기에 추가합니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{id}/bookmarks 의 형태로 이루어져야 합니다.
 * @param {Object} request.header.Authorization 사용자의 고유한 ID입니다.
 * @param {Object} request.body.email 사용자의 메일 주소입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const { email } = request.body
  const ids = request.body.ids.map(id => parseInt(id))
  const userId = request.get('Authorization')
  const createdAt = new Date()

  if (!userId) {
    response.status(401).end()
    return
  }

  try {
    ids.forEach(async (id) => {
      const hasBookmark = await exists('Bookmark', ['artworkId', id], ['userId', userId])
      if (!hasBookmark) {
        await Promise.all([
          datastore.save({
            key: datastore.key('Bookmark'),
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
    })

    const artworksKey = ids.map(id => datastore.key(['Artwork', id]))
    const [artworks] = await datastore.get(artworksKey)

    response.status(200).send({
      artworks: artworks.sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id)),
    })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
