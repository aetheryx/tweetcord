module.exports = async function addTimeline (options) {
  return this.dbTables['timelines'].insert(options);
};
