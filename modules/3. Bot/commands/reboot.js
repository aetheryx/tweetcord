async function rebootCommand (msg) {
  await this.bot.sendMessage(msg.channel.id, 'Restarting...');
  // TODO: call sigint handler's reboot
}

module.exports = {
  command: rebootCommand,
  name: 'reboot',
  aliases: ['restart'],
  ownerOnly: true,
  description: 'Bot owner only.',
};