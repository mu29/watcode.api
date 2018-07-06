const req = require.context('./handlers', false, /^.*\.js$/)

req.keys().forEach((key) => {
  const handlerName = key.replace(/^\.\/([^.]+)\.js$/, '$1')
  module.exports[handlerName] = req(key).default
})
