'use strict'

const datastore = require('@google-cloud/datastore')()

let artworkModules = null
let reactionModules = null

exports.artworks = (request, response) => {
  if (request.method !== 'GET') {
    response.status(422).send('해당 메소드는 지원하지 않습니다.')
    return
  }

  artworkModules = artworkModules || require('./modules/artworks')
  artworkModules.readArtworkList(request, response, datastore)
};

exports.views = (request, response) => {
  if (request.method !== 'POST') {
    response.status(422).send('해당 메소드는 지원하지 않습니다.')
    return
  }

  if (!request.path.match(/artworks\/(\d+)\/.*/)) {
    response.status(422).send({ message: '함수의 경로가 잘못되었습니다.' })
    return
  }

  reactionModules = reactionModules || require('./modules/artworks')
  reactionModules.createView(request, response, datastore)
}
