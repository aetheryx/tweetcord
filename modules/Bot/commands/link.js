async function linkCommand (msg) {
  const potentialLink = await this.db.getLink(msg.author.id);

  if (potentialLink) {
    return `You've already been linked with the twitter account \`@${potentialLink.name}\`.`;
  }

  return `Link your Twitter account here: ${this.config.web.domain}/link?id=${msg.author.id}`;
}

module.exports = {
  command: linkCommand,
  name: 'link',
  aliases: ['connect'],
  description: 'TODO'
};