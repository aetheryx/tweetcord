module.exports = async function getAllTimelines () {
  return this.dbTables['timelines']
    .find({})
    .toArray();
};
