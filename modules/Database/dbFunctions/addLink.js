module.exports = async function addLink (options) {
  return this.dbTables['links'].insertOne(options);
};
