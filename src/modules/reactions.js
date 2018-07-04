'use strict'

/**
 * 작품의 조회 횟수를 늘려줍니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
exports.createView = async (request, response, datastore) => {
  const pathRegex = /artworks\/(\d+)\/views/
  const code = parseInt(request.url.match(pathRegex)[1])
  const key = datastore.key(['Artwork', code])
  const artwork = await datastore.get(key)

  await datastore.save({
    key: key,
    data: {
      ...artwork[0],
      views: (artwork.views || 0) + 1
    },
  })
  response.status(201).end()
}

/**
 * 작품에 댓글을 남깁니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
exports.createComment = (request, response) => {
}

/**
 * 작품의 댓글 목록을 불러옵니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
exports.readCommentList = (request, response) => {
}
