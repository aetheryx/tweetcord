const { inspect } = require('util');
const { createContext, runInContext } = require('vm');

async function replCommand (msg) {
  let ctx = { ...this }; // Shallow clone
  createContext(ctx);

  let lastRanCommandOutput;

  const runCommand = async () => {
    const commandMsg = await this.bot.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3);
    if (commandMsg.content.startsWith('//')) {
      return runCommand();
    }

    if (commandMsg.content === '.exit') {
      return this.bot.sendMessage(msg.channel.id, 'Successfully exited.');
    }
    if (commandMsg.content === '.clear') {
      ctx = { ...this };
      createContext(ctx);
      this.bot.sendMessage(msg.channel.id, 'Successfully cleared variables.');
      return runCommand();
    }

    ctx.msg = commandMsg;
    ctx._ = lastRanCommandOutput;

    let result;
    try {
      result = await runInContext(commandMsg.content, ctx, {
        filename: 'aetheryx.repl'
      });

      lastRanCommandOutput = result;

      if (typeof result !== 'string') {
        result = inspect(result, {
          depth: +!(inspect(result, { depth: 1 }).length > 1990), // Results in either 0 or 1
          showHidden: true
        });
      }
    } catch (e) {
      const error = e.stack || e;
      result = `ERROR:\n${typeof error === 'string' ? error : inspect(error, { depth: 1 })}`;
    }

    this.bot.sendMessage(msg.channel.id, '```js\n' + result.replace(this.misc.credentialRX, 'i think the fuck not you trick ass bitch') + '\n```');

    runCommand();
  };

  runCommand();
  return 'REPL started. Run `.exit` to exit. Run `.clear` to clear.';
}

module.exports = {
  command: replCommand,
  name: 'repl',
  usage: '{command}',
  ownerOnly: true,
  description: 'Bot owner only.'
};
