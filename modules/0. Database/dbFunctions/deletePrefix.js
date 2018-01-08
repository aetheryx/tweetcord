async function deletePrefix (id) {
  const prefixes = this.dbTables['prefixes'];
  return prefixes.remove({ id });
}

module.exports = deletePrefix;