async function addLink (options) {
  const links = this.dbTables['links'];
  return links.insertOne(options);
}

module.exports = addLink;