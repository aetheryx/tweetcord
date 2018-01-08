async function getTimeline (channelID, userID) {
  return this.dbTables['timelines'].findOne({
    $or: [
      { userID },
      { channelID }
    ]
  });
}

module.exports = getTimeline;