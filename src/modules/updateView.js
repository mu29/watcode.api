import { update } from '../services/database'
import updatePopularity from './updatePopularity'

/**
 * 작품의 조회 횟수를 늘려줍니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{code}/views 의 형태로 이루어져야 합니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/views/
  const code = parseInt(request.url.match(pathRegex)[1])

  await Promise.all([
    update(['Artwork', code], artwork => ({ views: (artwork.views || 0) + 1 })),
    updatePopularity(1),
  ])

  response.status(201).end()
}
