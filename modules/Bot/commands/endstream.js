// commandProperties, { requiresLink, requiresTimeline, requiredArgs, commandFn }
const GenericCommand = require(`${__dirname}/_GenericCommand.js`);

module.exports = GenericCommand({
  name: 'endstream',
  description: 'Use this command to end any timeline streams.'
}, {
  requiresLink: true,
  requiresTimeline: true,
  commandFn: async function (msg, args, link, timeline) {
    if (this.streams[link.twitterID]) {
      await this.streams[link.twitterID]();
    }
    await this.db.deleteTimeline(msg.author.id);
    return `The tweet stream in <#${timeline.channelID}> is successfully deleted.`;
  }
});
