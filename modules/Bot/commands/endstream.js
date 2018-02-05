async function endstreamCommand (msg) {
  const timeline = await this.db.getTimeline(msg.author.id);
  if (!timeline) {
    return 'You currently do not have a stream.';
  }

  const link = await this.db.getLink(msg.author.id);

  await this.streams[link.twitterID]();
  await this.db.deleteTimeline(msg.author.id);
  return `The tweet stream in <#${timeline.channelID}> is successfully deleted.`;
}

module.exports = {
  command: endstreamCommand,
  name: 'endstream',
  description: 'TODO'
};