import { readArtworkList, readPopularArtworkList } from '../modules'

export default (request, response) => {
  if (request.method !== 'GET') {
    response.status(422).send('해당 메소드는 지원하지 않습니다.')
    return
  }

  if (request.url.match(/artworks\/popular.*/)) {
    readPopularArtworkList(request, response)
    return
  }

  readArtworkList(request, response)
}
