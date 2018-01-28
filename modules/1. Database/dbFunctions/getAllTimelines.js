async function getAllTimelines () {
  return this.dbTables['timelines']
    .find({})
    .then(r => r.toArray());
}

module.exports = getAllTimelines;