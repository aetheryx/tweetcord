async function helpCommand (msg, args) {
  const filteredCommands = [];
  for (const command in this.bot.commands) {
    if (!this.bot.commands[command].ownerOnly) {
      filteredCommands.push(command);
    }
  }

  const prefix = await this.db.getPrefix(msg.channel.guild ? msg.channel.guild.id : null);

  if (!args[0]) {
    const content = 'Run the `link` command to link your Twitter account, and then use the `setup` command to set up a stream of events to a specific channel.';

    return {
      content,
      embed: {
        description: filteredCommands.join(', ')
      }
    };
  } else {
    const command = this.bot.commands[args[0]] || this.bot.commands[Object.keys(this.bot.commands).find(c => this.bot.commands[c].aliases.includes(args[0]))];

    if (!command || command.ownerOnly) {
      return;
    }

    return {
      title: `Help for command: ${command.name}`,
      fields: [
        { name: 'Description:', value: command.description },
        { name: 'Usage:',       value: `${'```'}\n${command.usage.replace('{command}', prefix + command.name)}${'```'}` },
        { name: 'Aliases:',     value: command.aliases[0] ? command.aliases.join(', ') : 'None' }
      ]
    };
  }
}

module.exports = {
  command: helpCommand,
  name: 'help',
  usage: '{command} [command]',
  description: 'A help command. What did you expect?\nReturns information on using the bot, also allows you to view extra information on specific commands.'
};