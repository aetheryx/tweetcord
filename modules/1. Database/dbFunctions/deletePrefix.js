async function deletePrefix (id) {
  return this.dbTables['prefixes'].remove({ id }, true);
}

module.exports = deletePrefix;