async function inviteCommand (msg, args) {
  const IDArgument = msg.mentions[0] ? msg.mentions[0].id : args[0];
  return {
    description: `Click [here](https://discordapp.com/oauth2/authorize?permissions=27712&scope=bot&client_id=${msg.author.id === this.config.bot.ownerID ? IDArgument : this.bot.user.id}) to invite me to your server, ` +
      'or click [here](https://discord.gg/Yphr6WG) for an invite to Tweetcord\'s support server.'
  };
}

module.exports = {
  command: inviteCommand,
  name: 'invite',
  description: 'Returns an invite for Tweetcord and the support server.'
};
