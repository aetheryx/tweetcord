async function deletePrefix (id) {
  return this.dbTables['prefixes'].remove({ id });
}

module.exports = deletePrefix;