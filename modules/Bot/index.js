const { Client } = require('eris');
const fs = require('fs');
const events = require(`${__dirname}/events`);

function createBot () {
  const _this = this;

  return new Promise(resolve => {
    class Bot extends Client {
      constructor (props) {
        super(_this.config.bot.token, props);
        this.connect();

        this.commands = {};
        this.loadCommands();
        this.loadDonators();

        this.MessageCollector = new _this.utils.MessageCollector(this);

        this
          .once('ready', resolve)
          .on('ready', events.onReady.bind(_this))
          .on('messageCreate', events.onMessageCreate.bind(_this))
          .on('messageReactionAdd', events.onMessageReaction.add.bind(_this))
          .on('messageReactionRemove', events.onMessageReaction.remove.bind(_this));
      }

      async loadDonators () {
        _this.donators = await _this.utils.get({
          url: 'api.github.com/gists/ecb8d961b77871a56e7d3a7145cfc179'
        }).then(res => JSON.parse(res.files['donators.json'].content));
      }

      async loadCommands () {
        fs.readdir(`${__dirname}/commands`, (err, files) => {
          if (err) {
            return this.log(err.stack, 'error');
          }

          let failed = 0;

          for (const file of files.filter(r => !r.startsWith('_'))) {
            try {
              const command = require(`${__dirname}/commands/${file}`);
              this.commands[command.name] = Object.assign({
                aliases: [],
                ownerOnly: false,
                usage: '{command}'
              }, command);
            } catch (err) {
              failed++;
              _this.log(`Failed to load command ${file}: \n${err.stack}`, 'error');
            }
          }

          _this.log(`Successfully loaded ${files.length - failed}/${files.length} commands.`);
        });
      }

      async sendMessage (target, content, isUser = false) {
        if (content instanceof Object && !content.content) {
          content = { embed: content };
        }

        if (content.embed && !content.embed.color) {
          content.embed.color = _this.config.bot.embedColor;
        }

        try {
          if (isUser) {
            const DMChannel = await this.getDMChannel(target);
            return await DMChannel.createMessage(content); // return await is okay here
          } else {                                        //  because we're in a try-catch
            return await this.createMessage(target, content);
          }
        } catch (err) {
          if (
            !err.message.includes('Missing Permissions') && // TODO: re-test these and replace these strings with HTTP codes
            !err.message.includes('Cannot send messages to this user') &&
            !err.message.includes('Missing Access')
          ) {
            _this.log(`Unrecognized error: ${err.stack}\n${content}`, 'error');
          } else {
            return false;
          }
        }
      }
    }

    this.bot = new Bot({
      disableEveryone: true,
      maxShards: 'auto',
      messageLimit: 0,
      disableEvents: {
        CHANNEL_PINS_UPDATE: true,
        USER_SETTINGS_UPDATE: true,
        USER_NOTE_UPDATE: true,
        RELATIONSHIP_ADD: true,
        RELATIONSHIP_REMOVE: true,
        GUILD_BAN_ADD: true,
        GUILD_BAN_REMOVE: true,
        TYPING_START: true,
        MESSAGE_UPDATE: true,
        MESSAGE_DELETE: true,
        MESSAGE_DELETE_BULK: true,
        VOICE_STATE_UPDATE: true
      }
    });
  });
}

module.exports = {
  order: 3,
  func: createBot
};
