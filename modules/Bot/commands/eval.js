const { inspect } = require('util');

async function evalCommand (msg, args) {
  let input = args.join(' ');
  const silent = input.includes('--silent');
  const asynchr = input.includes('return') || input.includes('await');
  if (silent) {
    input = input.replace('--silent', '');
  }

  let result;
  try {
    result = await (asynchr ? eval(`(async()=>{${input}})();`) : eval(input)); // eslint-disable-line no-eval
    if (typeof result !== 'string') {
      result = inspect(result, {
        depth: +!(inspect(result, { depth: 1 }).length > 1990), // Results in either 0 or 1
        showHidden: true
      });
    }
    result = result.replace(this.misc.credentialRX, 'i think the fuck not you trick ass bitch');
  } catch (err) {
    result = err.message;
  }

  if (!silent) {
    return `${input}\n\`\`\`js\n${result}\n\`\`\``;
  }
}

module.exports = {
  command: evalCommand,
  name: 'eval',
  usage: '{command} <script>',
  aliases: ['ev', 'e'],
  ownerOnly: true,
  description: 'Bot owner only.'
};
