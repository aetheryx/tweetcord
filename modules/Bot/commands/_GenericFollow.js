// commandProperties, { requiresLink, requiresTimeline, requiredArgs, commandFn }
const GenericCommand = require(`${__dirname}/_GenericCommand.js`);
module.exports = (action) => GenericCommand({
  name: action,
  usage: `{command} <twitter handle you want to ${action}>`,
  description: `Use this command to ${action} people.`
}, {
  requiresLink: true,
  requiresTimeline: false,
  requiredArgs: `Missing required arguments. Who do you want to ${action}?`,
  commandFn: async function genericFollowCommand (msg, args, link) {
    if (msg.mentions[0]) {
      const targetLink = await this.db.getLink(msg.mentions[0].id);
      if (targetLink) {
        args = targetLink.name;
      } else {
        return 'This user doesn\'t have their account linked to Tweetcord.\nTry giving me their twitter handle instead, or convince to them to link up!';
      }
    } else {
      if (args[1]) {
        return 'Twitter user handles can\'t include a space.';
      }
      args = args.join(' ');
      if (args.startsWith('@')) {
        args = args.slice(1);
      }
    }

    const followers = await this.RestClient.friends(link).then(res => res.users.map(u => u.screen_name.toLowerCase()));
    if ((action === 'follow') === (followers.includes(args.toLowerCase()))) { // eslint-disable-line no-extra-parens
      return action === 'follow' ?
        `You're already following \`${args}\`.` :
        `You currently aren't following \`${args}\`.`;
    }

    const res = await this.RestClient[action](link, { screen_name: args }).catch(e => {
      if (e.errors && e.errors.find(e => e.code === 108)) {
        this.bot.sendMessage(msg.channel.id, `I am unable to find the user \`${args}\`.`);
      } else if (e.errors && e.errors.find(e => e.code === 158)) {
        this.bot.sendMessage(msg.channel.id, 'You can\'t follow yourself.');
      } else {
        throw e;
      }
    });

    if (res) {
      return {
        description: `Successfully ${action}ed [${args}](https://twitter.com/${args}).`
      };
    }
  }
});