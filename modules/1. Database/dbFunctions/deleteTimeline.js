async function deleteTimeline (id) {
  return this.dbTables['timelines'].remove({ id }, true);
}

module.exports = deleteTimeline;