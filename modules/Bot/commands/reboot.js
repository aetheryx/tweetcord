async function rebootCommand (msg) {
  await this.bot.sendMessage(msg.channel.id, 'Restarting...');
  this.gracefulExit();
}

module.exports = {
  command: rebootCommand,
  name: 'reboot',
  aliases: ['restart'],
  ownerOnly: true,
  description: 'Bot owner only.',
};