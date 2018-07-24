import { readRecommendationList } from '../modules'

export default (request, response) => {
  switch (request.method) {
    case 'GET':
      readRecommendationList(request, response)
      break
    case 'OPTIONS':
      response.status(200).end()
      break
    default:
      response.status(422).send('해당 메소드는 지원하지 않습니다.')
      break
  }
}
