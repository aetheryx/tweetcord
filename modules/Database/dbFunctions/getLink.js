async function getLink (discordID) {
  return this.dbTables['links'].findOne({ discordID });
}

module.exports = getLink;