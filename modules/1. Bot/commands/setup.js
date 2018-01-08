async function setupCommand (msg) {
  if (!msg.channelMentions[0]) {
    return 'You need to mention a channel.';
  }

  const linkInfo = await this.db.getLink(msg.author.id);

  if (!linkInfo) {
    return `You haven't linked your Twitter account yet. Please do here: ${this.config.web.domain}/link?id=${msg.author.id}`;
  }

  const potentialTimeline = await this.db.getTimeline(msg.channelMentions[0], msg.author.id);

  if (potentialTimeline) {
    const channel = potentialTimeline.channelID === msg.channelMentions[0];
    return channel ?
      `The channel <#${msg.channelMentions}> has already been linked with ${msg.author.id === potentialTimeline.userID && 'you' || await this.RestClient.getTagByID(potentialTimeline.userID)}.` :
      `You've already linked with <#${potentialTimeline.channelID}>.`;
  }

  await this.db.addTimeline(msg.channelMentions[0], msg.author.id);
  return `<#${msg.channelMentions[0]}> has been successfully set up for your timeline. Any new tweets will now appear there.`;
}

module.exports = {
  command: setupCommand,
  name: 'setup',
  aliases: ['setchannel'],
  description: ''
};