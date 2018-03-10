const { exec } = require('child_process');

async function execCommand (msg, args) {
  if (!args[0]) {
    return 'Missing required arguments.';
  }

  exec(args.join(' '), async (e, stdout, stderr) => {
    if (!stderr && !stdout) {
      msg.addReaction('\u2611');
    } else {
      this.bot.sendMessage(msg.channel.id, `${stdout ? `Info: \`\`\`\n${stdout}\n\`\`\`` : ''}\n${stderr ? `Errors: \`\`\`\n${stderr}\`\`\`` : ''}`);
    }
  });
}

module.exports = {
  command: execCommand,
  name: 'exec',
  usage: '{command} <command>',
  ownerOnly: true,
  description: 'Bot owner only.'
};
