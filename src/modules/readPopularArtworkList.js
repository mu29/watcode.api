/**
 * 인기 작품 목록을 보여줍니다. 한 번에 최대 15개의 결과를 보여줄 수 있습니다.
 *
 * @param {Object} request Cloud Function의 request context 입니다.
 * @param {String} request.query.cursor 목록의 첫 아이템의 위치입니다.
 * @param {Number} request.query.period 작품에 대한 반응을 집계할 기간입니다.
 * @param {Object} response Cloud Function의 response context 입니다.
 */
export const popularArtworkList = (request, response) => {
}
