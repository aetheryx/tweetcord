async function donateCommand (msg) {
  const isKnown = this.bot.guilds.get('299979631715549184').members.has(msg.author.id);

  return {
    description: 'Tweetcord will always remain a fully free service. However, if you would like to donate, you can do so [here](https://paypal.me/Aether2017) (PayPal) or to `18UNsWHGvskZSxKc6LvyaqwKk5FUf2af4D` (BTC).' +
      '\n\nAs a donator, you will receive:\n' +
      ' • A `Donator` role on [Aetheryx\' Hub](https://discord.gg/Yphr6WG) (Any amount)\n' +
      ` • Your name and a custom phrase on the ${isKnown ? '<#409526602716676106>' : '#donators'} channel on [Aetheryx' Hub](https://discord.gg/Yphr6WG) (Any amount)\n` +
      ' • Your name and a custom phrase on this command (At least $1.00)\n' +
      ` • Lots of hugs & kisses from ${isKnown ? '<@284122164582416385>' : 'Aetheryx'} (Any amount :kissing_heart:)\n\n` +
      'Donators so far:',
    fields: [
      { name: 'Melmsie#0001', value: '*"If tomorrow all bots got destroyed, all the work I\'ve done on them,\nAnd I had to start again, with just notepad++.\nI\'d thank my lucky friends, to live this awesome life,\n\'Cause Discord\'s still is the best, and I won\'t let it decay!\n\nAnd I\'m proud to be a developer, where I develop things for fun.\nAnd I won\'t forget the people who\'ve helped, and taught me the things I know.\nAnd I\'ll gladly stand up next to them and give them a big hug.\n\'Cause there ain\'t no doubt I love these bots: God bless Discord API.\n\nFrom Discord.py, to Discord.unity,\nAcross Discord.net, from nyx to JDA\nFrom Discordia to Eris, and DiscordPHP,\nWell there\'s always Discord.js,\nAnd it\'s time we stand and say:\n\nThat we\'re proud to be developers, where we develop things for fun.\nAnd we won\'t forget the people who\'ve helped, and taught us the things we know.\\nAnd we\'ll gladly stand up next to them and give them a big hug.\n\'Cause there ain\'t no doubt we love these bots: God bless Discord API."*' },

      { name: '**Kromatic#0420**', value: '[*I said scuse me muh\'fucka, do you like jellybeans?\nHe was like "yeah but not the black and the green ones\nMOTHAFUCKA WHO SAID I HAD EASTER JELLYBEANS?\nto make a long fucking story short, i put a whole bag of jellybeans up my ass\nand it\'s 24 hours later and i ain\'t find nuttn yet*](https://www.youtube.com/watch?v=Cnq0vVPNPG8)' } // TODO: move this to an external file, gist maybe?
    ],
    footer: { text: 'If you do decide to donate, please DM Aetheryx#2222 with proof.' }
  };
}

module.exports = {
  command: donateCommand,
  name: 'donate',
  description: 'Returns information regarding donations.'
};