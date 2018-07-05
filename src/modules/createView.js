import { update } from '../services/database'

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
  const today = parseInt(Date.now() / (86400 * 1000))

  await Promise.all([
    update(['Artwork', code], artwork => ({ views: (artwork.views || 0) + 1 })),
    update(['Counter', code], (counter) => {
      // 일별 조회 수 소스를 가져옵니다.
      const source = counter.source || Array(30).fill(0)
      // 날짜가 변경된 경우 가장 오래된 조회 데이터를 삭제합니다.
      if (today !== counter.updatedAt) {
        source.shift()
        source.push(0)
      }
      // 오늘 조회 수를 늘려줍니다.
      source.push(source.pop() + 1)
      source.reverse()

      const sum = (src, count) => src.slice(0, count).reduce((e, r) => e + r, 0)

      return {
        code,
        day: sum(source, 2),
        week: sum(source, 7),
        month: sum(source, 30),
        source: source.reverse(),
        updatedAt: today,
      }
    }),
  ])

  response.status(201).end()
}
