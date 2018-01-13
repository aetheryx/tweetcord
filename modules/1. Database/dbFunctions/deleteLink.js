async function deleteLink (id) {
  return this.dbTables['links'].remove({ id }, true);
}

module.exports = deleteLink;