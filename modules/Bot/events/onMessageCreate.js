const { inspect } = require('util');

async function onMessageCreate (msg) {
  if (msg.author.bot) {
    return;
  }

  const mentionPrefix = msg.content.match(new RegExp(`^<@!*${this.bot.user.id}>`));
  const prefix = mentionPrefix ? `${mentionPrefix[0]} ` : await this.db.getPrefix(msg.channel.guild ? msg.channel.guild.id : null);
  if (!msg.content.toLowerCase().startsWith(prefix)) {
    return;
  }

  // eslint-disable-next-line prefer-const
  let [command, ...args] = msg.cleanContent.slice(prefix.length).split(' ').filter(Boolean);

  if (!command) {
    return;
  } else {
    command = command.toLowerCase();
  }

  if (command in this.bot.commands) {
    command = this.bot.commands[command];
  } else {
    const potentialCommand = Object.keys(this.bot.commands).find(c => this.bot.commands[c].aliases.includes(command));
    if (potentialCommand) {
      command = this.bot.commands[potentialCommand];
    }
  }

  if (command && command instanceof Object) {
    if (command.ownerOnly && msg.author.id !== this.config.bot.ownerID) {
      return;
    }

    command.command.call(this, msg, args)
      .then(res => {
        if (res && (typeof res === 'string' || res instanceof Object)) {
          this.bot.sendMessage(msg.channel.id, res);
        }
      })
      .catch(e => {
        this.log(e.stack || inspect(e), 'error');
        msg.channel.createMessage(`Something went wrong while executing this command. The error has been logged. \nPlease join here (discord.gg/Yphr6WG) if the issue persists.\n\`\`\`${e.message || inspect(e)}\`\`\``);
      });
  } else if (
    msg.mentions.find(u => u.id === this.client.user.id) &&
    msg.content.toLowerCase().includes('help')
  ) {
    return this.bot.commands['help'].command.call(null, msg);
  }
}

module.exports = onMessageCreate;