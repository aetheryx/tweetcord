module.exports = async function getTimeline (id) {
  return this.dbTables['timelines'].findOne({
    $or: [
      { userID: id },
      { channelID: id }
    ]
  });
};
