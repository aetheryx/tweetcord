async function getPrefix (id) {
  const prefixes = this.dbTables['prefixes'];
  const prefix = await prefixes.findOne({ id });
  return prefix ? prefix.prefix : this.config.bot.defaultPrefix;
}

module.exports = getPrefix;