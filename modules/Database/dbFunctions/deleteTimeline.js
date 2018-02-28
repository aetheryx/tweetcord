module.exports = async function deleteTimeline (id) {
  return this.dbTables['timelines'].remove({
    $or: [
      { userID: id },
      { channelID: id }
    ]
  });
};
