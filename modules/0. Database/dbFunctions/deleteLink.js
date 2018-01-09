async function deleteLink (id) {
  return this.dbTables['links'].remove({ id });
}

module.exports = deleteLink;