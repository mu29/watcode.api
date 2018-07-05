import Datastore from '@google-cloud/datastore'

export const datastore = Datastore()

export const update = async (key, data) => {
  try {
    const entityKey = datastore.key(key)
    const entity = (await datastore.get(entityKey))[0] || {}
    await datastore.save({
      key: entityKey,
      data: {
        ...entity,
        ...(typeof data === 'function' ? data(entity) : data),
      }
    })
  } catch (error) {
    console.error(error)
  }
}
