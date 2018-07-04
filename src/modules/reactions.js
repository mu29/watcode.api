import Datastore from '@google-cloud/datastore'

const datastore = Datastore()

/**
 * 작품의 조회 횟수를 늘려줍니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export const createView = async (request, response) => {
  const pathRegex = /artworks\/(\d+)\/views/
  const code = parseInt(request.url.match(pathRegex)[1])

  const artworkKey = datastore.key(['Artwork', code])
  const artwork = await datastore.get(artworkKey)
  await datastore.save({
    key: artworkKey,
    data: {
      ...artwork[0],
      views: (artwork[0].views || 0) + 1
    },
  })

  const today = parseInt(new Date().toISOString().split('T')[0].replace(/-/g, ''))
  const counterKey = datastore.key(['Artwork', code, 'Counter', today])
  const counter = await datastore.get(counterKey)
  await datastore.save({
    key: counterKey,
    data: {
      ...(counter[0] || {}),
      views: ((counter[0] || {}).views || 0) + 1,
    }
  })

  response.status(201).end()
}

/**
 * 작품에 댓글을 남깁니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export const createComment = (request, response) => {
}

/**
 * 작품의 댓글 목록을 불러옵니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export const readCommentList = (request, response) => {
}
