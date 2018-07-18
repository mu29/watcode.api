import { datastore } from '../services/database'

/**
 * 사용자의 즐겨찾기 목록을 불러옵니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export default async (request, response) => {
  const userId = request.get('Authorization')
  const query = datastore
    .createQuery('Bookmark')
    .filter('userId', userId)

  try {
    const [entities, info] = await datastore.runQuery(query)
    const bookmarks = entities.map(entity => {
      delete entity.userId
      return {
        id: entity[datastore.KEY].id,
        ...entity,
      }
    })
    response.status(200).send({ bookmarks })
  } catch (error) {
    console.error(error)
    response.status(422).send(error)
  }
}
