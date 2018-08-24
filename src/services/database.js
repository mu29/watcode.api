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

export const find = async (kind, ...filters) => {
  let query = datastore.createQuery(kind).limit(1)
  filters.forEach(filter => query = query.filter(filter[0], filter[1]))

  const [entities] = await datastore.runQuery(query)
  const entity = entities[0] || {}
  return {
    id: parseInt(entity[datastore.KEY].id),
    ...entity,
  }
}

export const exists = async (kind, ...filters) => {
  let query = datastore.createQuery(kind).limit(1)
  filters.forEach(filter => query = query.filter(filter[0], filter[1]))

  const [entities] = await datastore.runQuery(query)
  return entities.length > 0
}
