async function addTimeline (channelID, userID) {
  return this.dbTables['timelines'].insert({
    userID,
    channelID
  });
}

module.exports = addTimeline;