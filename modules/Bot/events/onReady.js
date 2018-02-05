async function onReady () {
  this.log('Bot successfully logged in');
  this.bot.editStatus('online', {
    name: `${this.config.bot.defaultPrefix}help`
  });
}

module.exports = onReady;