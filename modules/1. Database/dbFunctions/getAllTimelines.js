async function getAllTimelines () {
  return this.dbTables['timelines']
    .find({})
    .toArray()
}

module.exports = getAllTimelines;