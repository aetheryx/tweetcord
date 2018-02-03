async function addLink (options) {
  console.log(options)
  return this.dbTables['links'].insertOne(options);
}

module.exports = addLink;