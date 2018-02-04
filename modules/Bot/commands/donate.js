async function donateCommand (msg) {
  const isKnown = this.bot.guilds.get('299979631715549184').members.has(msg.author.id);

  return {
    description: 'Tweetcord will always remain a fully free service. However, if you would like to donate, you can do so [here](https://paypal.me/Aether2017) (PayPal) or to `18UNsWHGvskZSxKc6LvyaqwKk5FUf2af4D` (BTC).' +
      '\n\nAs a donator, you will receive:\n' +
      ' • A `Donator` role on [Aetheryx\' Hub](https://discord.gg/Yphr6WG) (Any amount)\n' +
      ` • Your name and a custom phrase on the ${isKnown ? '<#409526602716676106>' : '#donators'} channel on [Aetheryx' Hub](https://discord.gg/Yphr6WG) (Any amount)\n` +
      ' • Your name and a custom phrase on this command (At least $1.00)\n' +
      ` • Lots of hugs & kisses from ${isKnown ? '<@284122164582416385>' : 'Aetheryx'} (Any amount :kissing_heart:)\n\u200b`,
    fields: [
      { name: 'Donators so far', value: '**Melmsie#0001** - "*I barely speak english*"\n**Kromatic#0420** - "*Still trying to think of one :LUL:*"' } // TODO: move this to an external file, gist maybe?
    ],
    footer: { text: 'If you do decide to donate, please DM Aetheryx#2222 with proof.' }
  };
}

module.exports = {
  command: donateCommand,
  name: 'donate',
  description: 'Returns information regarding donations.'
};