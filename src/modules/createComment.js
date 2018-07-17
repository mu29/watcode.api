import { datastore } from '../services/database'
import updatePopularity from './updatePopularity'

/**
 * 작품에 댓글을 남깁니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{id}/comments 의 형태로 이루어져야 합니다.
 * @param {Object} request.header.Authorization 댓글 작성자의 고유한 ID입니다.
 * @param {Object} request.body.author 댓글 작성자의 닉네임입니다.
 * @param {Object} request.body.content 댓글 내용입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/comments/
  const artworkId = parseInt(request.url.match(pathRegex)[1])
  const { email, author, content } = request.body
  const userId = request.get('Authorization')
  const key = datastore.key('Comment')
  const createdAt = new Date()

  if (!content || content.length === 0) {
    response.status(422).send({ message: '빈 댓글을 달 수 없습니다.' })
    return
  }

  try {
    const [apiResponse] = await datastore.save({
      key,
      data: {
        artworkId,
        userId,
        email,
        author,
        content,
        createdAt,
      }
    })
    const { id } = apiResponse.mutationResults[0].key.path[0]
    await Promise.all([
      update(['Artwork', artworkId], artwork => ({ comments: (artwork.comments || 0) + 1 })),
      updatePopularity(artworkId, 10),
    ])
    response.status(201).send({
      id,
      email,
      author,
      content,
      createdAt,
    })
  } catch (error) {
    response.status(422).send(error)
  }
}
