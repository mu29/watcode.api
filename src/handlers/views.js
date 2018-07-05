import { createView } from '../modules'

const views = (request, response) => {
  if (request.method !== 'POST') {
    response.status(422).send('해당 메소드는 지원하지 않습니다.')
    return
  }

  if (!request.url.match(/artworks\/(\d+)\/.*/)) {
    response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
    return
  }

  createView(request, response)
}

export default views
