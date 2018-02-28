module.exports = async function deleteLink (discordID) {
  return this.dbTables['links'].remove({ discordID });
};
