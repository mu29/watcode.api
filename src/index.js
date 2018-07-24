/* 추천 서버 설정 */
process.env.RACCOON_REDIS_AUTH='KkpL815nhNsR'
process.env.RACCOON_REDIS_URL='35.226.233.17'

const req = require.context('./handlers', false, /^.*\.js$/)

req.keys().forEach((key) => {
  const handlerName = key.replace(/^\.\/([^.]+)\.js$/, '$1')
  module.exports[handlerName] = req(key).default
})
