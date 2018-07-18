import { readCommentList, createComment, deleteComment } from '../modules'

export default (request, response) => {
  switch (request.method) {
    case 'GET':
      if (!request.url.match(/artworks\/(\d+)\/comments.*/)) {
        response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
        return
      }
      readCommentList(request, response)
      break
    case 'POST':
      if (!request.url.match(/artworks\/(\d+)\/comments.*/)) {
        response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
        return
      }
      createComment(request, response)
      break
    case 'DELETE':
      if (!request.url.match(/comments\/(\d+)/)) {
        response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
        return
      }
      deleteComment(request, response)
      break
    case 'OPTIONS':
      response.status(200).end()
      break
    default:
      response.status(422).send('해당 메소드는 지원하지 않습니다.')
      break
  }
}
