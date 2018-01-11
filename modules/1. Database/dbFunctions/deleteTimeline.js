async function deleteTimeline (id) {
  return this.dbTables['timelines'].remove({ id });
}

module.exports = deleteTimeline;