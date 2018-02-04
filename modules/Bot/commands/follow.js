async function followCommand (msg, args) {
  args = args.join(' ');
  if (!args) {
    return 'Missing required arguments. Who do you want to follow?';
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

  const followers = await this.RestClient.friends(link).then(res => res.users.map(u => u.screen_name.toLowerCase()));
  if (followers.includes(args.toLowerCase())) {
    return `You're already following \`${args}\`.`;
  }

  const res = await this.RestClient.follow(link, { screen_name: args }).catch(e => {
    if (e.errors && e.errors.find(e => e.code === 108)) {
      this.bot.sendMessage(msg.channel.id, `I am unable to find the user \`${args}\`.`);
    } else {
      throw e;
    }
  });

  if (res) {
    return {
      description: `Successfully followed [${args}](https://twitter.com/${args}).`
    };
  }
}

module.exports = {
  command: followCommand,
  name: 'follow',
  description: ''
};