async function deleteLink (discordID) {
  return this.dbTables['links'].remove({ discordID });
}

module.exports = deleteLink;