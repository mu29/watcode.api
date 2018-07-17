import { datastore, update } from '../services/database'
import updatePopularity from './updatePopularity'

/**
 * 작품 내용을 보여줍니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{id} 의 형태로 이루어져야 합니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)/
  const id = parseInt(request.url.match(pathRegex)[1])

  try {
    const key = datastore.key(['Artwork', id])
    const [artwork = {}] = await datastore.get(key)
    await Promise.all([
      update(['Artwork', id], artwork => ({ views: (artwork.views || 0) + 1 })),
      updatePopularity(id, 1),
    ])
    response.status(200).send({ artwork })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
