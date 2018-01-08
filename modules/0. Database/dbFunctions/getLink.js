async function getLink (id) {
  return this.dbTables['links'].findOne({ id });
}

module.exports = getLink;