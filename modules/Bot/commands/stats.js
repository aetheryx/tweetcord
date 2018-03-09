const os = require('os');
const totalMem = os.totalmem();
const { VERSION: erisVersion } = require('eris');
const { version: mongoVersion } = require('mongodb/package.json');

const inline = true;

async function statsCommand (msg) {
  const { rss: memUsage } = process.memoryUsage();
  const shard = msg.channel.guild
    ? msg.channel.guild.shard
    : this.bot.shards.get(0);

  return {
    title: `Tweetcord v${this.package.version}`,
    url: 'https://tweetcord.xyz',
    fields: [
      { name: 'Guilds', value: this.bot.guilds.size, inline },
      { name: 'Uptime', value: this.utils.parseDuration(process.uptime()), inline },
      { name: 'Ping', value: `${shard.latency.toFixed()} ms`, inline },
      { name: 'Libraries',
        value: [
          `[Eris](https://abal.moe/Eris) v${erisVersion}`,
          `[Node.js](https://nodejs.org/en/) ${process.version}`,
          `[MongoDB](https://github.com/mongodb/node-mongodb-native/tree/3.0.0) v${mongoVersion}`
        ].join('\n'),
        inline },
      { name: 'RAM Usage', value: `${(memUsage / 1048576).toFixed()}MB/${(totalMem / 1073741824).toFixed(1)} GB\n(${(memUsage / totalMem * 100).toFixed(2)}%)`, inline },
      { name: 'System Info', value: `${process.platform} (${process.arch})\n${(totalMem > 1073741824 ? `${(totalMem / 1073741824).toFixed(1)} GB` : `${(totalMem / 1048576).toFixed(2)} MB`)}`, inline },
      { name: 'Links',
        value: [
          `[Bot invite](https://discordapp.com/oauth2/authorize?permissions=27648&scope=bot&client_id=${this.bot.user.id})`,
          '[Support server invite](https://discord.gg/Yphr6WG)',
          '[GitHub](https://github.com/aetheryx/tweetcord)',
          '[Website](https://tweetcord.xyz)'
        ].join(' | ') }
    ],
    footer: { text: 'Created by Aetheryx#2222' }
  };
}

module.exports = {
  command: statsCommand,
  name: 'stats',
  aliases: ['info'],
  description: 'Returns information and statistics about Tweetcord.'
};
