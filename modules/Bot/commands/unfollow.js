async function unfollowCommand (msg, args) {
  args = args.join(' ');
  if (!args) {
    return 'Missing required arguments.';
  }
  if (args.includes(' ')) {
    return 'Twitter user handles can\'t include a space.';
  }
  if (args.startsWith('@')) {
    args = args.slice(1);
  }

  const link = await this.db.getLink(msg.author.id);

  if (!link) {
    return `You haven't linked your Twitter account yet. Please do here: ${this.config.web.domain}/link?id=${msg.author.id}`;
  }

  const res = await this.RestClient.unfollow(link, { screen_name: args }).catch(e => {
    if (e.errors && e.errors.find(e => e.code === 108)) {
      this.bot.sendMessage(msg.channel.id, `I am unable to find the user \`${args}\`.`);
    }
  });

  if (res) {
    return {
      description: `Successfully unfollowed [${args}](https://twitter.com/${args}).`
    }
  }
}

module.exports = {
  command: unfollowCommand,
  name: 'unfollow',
  description: ''
};