async function donateCommand () {
  return {
    description: 'Tweetcord will always remain a fully free service. However, if you would like to donate, you can do so [here](https://paypal.me/Aether2017) (PayPal) or to `18UNsWHGvskZSxKc6LvyaqwKk5FUf2af4D` (BTC).' +
      '\n\nAs a donator, you will receive:\n' +
      ' • A `Donator` role on [Aetheryx\' Hub](https://discord.gg/Yphr6WG) (Any amount)\n' +
      ' • Your name and a custom phrase on the #donators channel on [Aetheryx\' Hub](https://discord.gg/Yphr6WG) (Any amount)\n' +
      ' • Your name and a custom phrase on this command (At least $1.00)\n' +
      ' • Lots of hugs & kisses from (Any amount :kissing_heart:)\n\n' +
      'Donators so far:',
    fields: this.donators,
    footer: { text: 'If you do decide to donate, please DM Aetheryx#2222 with proof.' }
  };
}

module.exports = {
  command: donateCommand,
  name: 'donate',
  description: 'Returns information regarding donations.'
};
