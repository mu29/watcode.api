import { datastore, update } from '../services/database'
import updatePopularity from './updatePopularity'

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
  const artworkId = parseInt(request.url.match(pathRegex)[1])
  const { email } = request.body
  const userId = request.get('Authorization')
  const key = datastore.key('Bookmark')
  const createdAt = new Date()

  if (!userId) {
    response.status(401).end()
  }

  try {
    const [apiResponse] = await datastore.save({
      key,
      data: {
        artworkId,
        userId,
        email,
        createdAt,
      }
    })
    const { id } = apiResponse.mutationResults[0].key.path[0]
    await Promise.all([
      update(['Artwork', artworkId], artwork => ({ bookmarks: (artwork.bookmarks || 0) + 1 })),
      updatePopularity(artworkId, 20),
    ])
    response.status(201).send({
      id,
      artworkId,
      email,
      createdAt,
    })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
