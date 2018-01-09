async function rebootCommand (msg) {
  await this.bot.sendMessage(msg.channel.id, 'Restarting...');
  await this.bot.disconnect({ reconnect: false });
  await this.dbClient.close();
  await this.server.close();
  for (const job of this.jobs) {
    clearInterval(job);
  }
  setTimeout(process.exit, 30e3); // just in case
}

module.exports = {
  command: rebootCommand,
  name: 'reboot',
  aliases: ['restart'],
  ownerOnly: true,
  description: 'Bot owner only.',
};