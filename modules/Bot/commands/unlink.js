async function unlinkCommand (msg) {
  const link = await this.db.getLink(msg.author.id);
  if (!link) {
    return `How do you want to unlink if you aren't linked yet?\n\nLink your Twitter account here: ${this.config.web.domain}/link`;
  }

  if (this.streams[link.twitterID]) {
    await this.streams[link.twitterID]();
  }
  await this.db.deleteTimeline(msg.author.id);
  await this.db.deleteLink(msg.author.id);
  return 'Your link was successfully removed from our database. Don\'t forget to revoke access here: https://twitter.com/settings/applications';
}

module.exports = {
  command: unlinkCommand,
  name: 'unlink',
  description: 'TODO'
};
