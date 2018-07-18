import {
  readArtwork,
  readArtworkList,
  searchArtworkList,
  readPopularArtworkList,
} from '../modules'

export default (request, response) => {
  switch (request.method) {
    case 'GET':
      if (request.url.match(/artworks\/popular.*/)) {
        readPopularArtworkList(request, response)
        return
      }

      if (request.url.match(/artworks\/search.*/)) {
        searchArtworkList(request, response)
        return
      }

      if (request.url.match(/artworks\/(\d+).*/)) {
        readArtwork(request, response)
        return
      }

      readArtworkList(request, response)
      break
    case 'OPTIONS':
      response.status(200).end()
      break
    default:
      response.status(422).send('해당 메소드는 지원하지 않습니다.')
      break
  }
}
