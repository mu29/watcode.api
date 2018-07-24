import raccoon from 'raccoon'
import { datastore } from '../services/database'

/**
 * 사용자별 추천 작품 목록을 불러옵니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const userId = request.get('Authorization')
  if (!userId) {
    response.status(401).end()
    return
  }

  try {
    const ids = await raccoon.recommendFor(userId, 100)
    const keys = ids.map(id => datastore.key(['Artwork', id]))
    const [artworks] = await datastore.get(keys)

    response.status(200).send({
      artworks: artworks.sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id)),
    })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
