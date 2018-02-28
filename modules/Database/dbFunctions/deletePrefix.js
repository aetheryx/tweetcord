module.exports = async function deletePrefix (id) {
  return this.dbTables['prefixes'].remove({ id });
};
