const { inspect } = require('util');
const { createContext, runInContext } = require('vm');

async function replCommand (msg) {
  let ctx = { ...this }; // Shallow clone
  createContext(ctx);

  let lastRanCommandOutput;
  let statementQueue = [];

  const runCommand = async () => {
    const commandMsg = await this.bot.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 60e3);
    if (!commandMsg) {
      return this.bot.sendMessage(msg.channel.id, 'Timed out, automatically exiting REPL...');
    }

    let { content } = commandMsg;

    if (content.startsWith('//')) {
      return runCommand();
    }
    if (content === '.exit') {
      return this.bot.sendMessage(msg.channel.id, 'Successfully exited.');
    }
    if (content === '.clear') {
      ctx = { ...this };
      createContext(ctx);
      statementQueue = [];
      this.bot.sendMessage(msg.channel.id, 'Successfully cleared variables.');
      return runCommand();
    }

    ctx.msg = commandMsg;
    ctx._ = lastRanCommandOutput;

    if (content.endsWith('}') && statementQueue[0]) {
      // Closing bracket - we consume the statement queue
      statementQueue.push(content);
      content = statementQueue.join('\n');
      statementQueue = [];
    } else if (content.endsWith('{') || statementQueue[0]) {
      // Opening bracket - we either open the statement queue or append to it
      statementQueue.push(content.endsWith('{')
        ? content
        : '  ' + content); // Indentation for appended statements
      this.bot.sendMessage(msg.channel.id, `\`\`\`js\n${statementQueue.join('\n')}\n  ...\n\`\`\``);
      return runCommand();
    }

    let result;
    try {
      result = await runInContext(content, ctx, {
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

    this.bot.sendMessage(msg.channel.id, '```js\n' + this.misc.redact(result) + '\n```');

    runCommand();
  };

  runCommand();
  return 'REPL started. Available commands:\n```\n.exit\n.clear\n_\n```';
}

module.exports = {
  command: replCommand,
  name: 'repl',
  usage: '{command}',
  ownerOnly: true,
  description: 'Bot owner only.'
};
