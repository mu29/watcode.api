import { datastore } from '../services/database'

/**
 * 작품에 댓글을 남깁니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.url 요청 경로는 /artworks/{code}/comments 의 형태로 이루어져야 합니다.
 * @param {Object} request.header.Authorization 댓글 작성자의 고유한 ID입니다.
 * @param {Object} request.body.author 댓글 작성자의 닉네임입니다.
 * @param {Object} request.body.content 댓글 내용입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/comments/
  const artworkId = parseInt(request.url.match(pathRegex)[1])
  const content = request.body.content
  const author = request.body.author
  const userId = request.get('Authorization')
  const key = datastore.key('Comment')

  try {
    const [comment] = await datastore.save({
      key,
      data: {
        artworkId,
        userId,
        author,
        content,
        createdAt: new Date(),
      }
    })
    response.status(201).send(comment)
  } catch (error) {
    response.status(422).send(error)
  }
}
