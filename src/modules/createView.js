import { update } from '../services/database'

/**
 * 작품의 조회 횟수를 늘려줍니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/views/
  const code = parseInt(request.url.match(pathRegex)[1])

  const day = parseInt(Date.now() / 86400 * 1000)
  const week = parseInt(Date.now() / 86400 * 1000 * 7)
  const month = parseInt(Date.now() / 86400 * 1000 * 30)

  await Promise.all([
    update(['Artwork', code], artwork => ({ views: (artwork.views || 0) + 1 })),
    update(['Artwork', code, 'Counter', day], counter => ({ views: (counter.views || 0) + 1 })),
    update(['Artwork', code, 'Counter', week], counter => ({ views: (counter.views || 0) + 1 })),
    update(['Artwork', code, 'Counter', month], counter => ({ views: (counter.views || 0) + 1 })),
  ])

  response.status(201).end()
}
