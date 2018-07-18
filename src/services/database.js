import Datastore from '@google-cloud/datastore'

export const datastore = Datastore()

export const update = async (key, data) => {
  try {
    const entityKey = datastore.key(key)
    const [entity = {}] = await datastore.get(entityKey)
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

export const find = async (kind, property, value) => {
  const query = datastore
    .createQuery(kind)
    .filter(property, value)
    .limit(1)

  const [entities] = await datastore.runQuery(query)
  const entity = entities[0] || {}
  return {
    id: entity[datastore.KEY].id,
    ...entity,
  }
}
