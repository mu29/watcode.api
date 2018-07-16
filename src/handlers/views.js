import { updateView } from '../modules'

export default (request, response) => {
  if (!request.url.match(/artworks\/(\d+)\/.*/)) {
    response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
    return
  }

  switch (request.method) {
    case 'POST':
      updateView(request, response)
      break
    case 'OPTIONS':
      response.status(200).end()
      break
    default:
      response.status(422).send('해당 메소드는 지원하지 않습니다.')
      break
  }
}
