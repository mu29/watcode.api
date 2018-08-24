import { readBookmarkList, createBookmark, createBookmarkList, deleteBookmark } from '../modules'

export default (request, response) => {
  switch (request.method) {
    case 'GET':
      readBookmarkList(request, response)
      break
    case 'POST':
      if (request.url.match(/bookmarks.*/)) {
        createBookmarkList(request, response)
        return
      }

      if (!request.url.match(/artworks\/(\d+)\/bookmarks.*/)) {
        response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
        return
      }
      createBookmark(request, response)
      break
    case 'DELETE':
      if (!request.url.match(/bookmarks\/(\d+)/)) {
        response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
        return
      }
      deleteBookmark(request, response)
      break
    case 'OPTIONS':
      response.status(200).end()
      break
    default:
      response.status(422).send('해당 메소드는 지원하지 않습니다.')
      break
  }
}
