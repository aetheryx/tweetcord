async function addLink (options) {
  return this.dbTables['links'].insertOne(options);
}

module.exports = addLink;