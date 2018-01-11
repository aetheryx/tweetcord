async function getAllTimelines () {
  return (await this.dbTables['timelines']
    .find({}))
    .toArray();
}

module.exports = getAllTimelines;