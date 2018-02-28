const botPackage = require(`${__dirname}/package.json`);
const modules = require(`${__dirname}/modules`);

class Tweetcord {
  constructor () {
    this.config = require('./config.json');

    if (!this.config.web.domain) {
      this.config.web.domain = 'http://localhost:42069';
    }

    this.importModules();
  }

  async importModules () {
    for (const module of modules.sort((a, b) => a.order - b.order)) {
      await module
        .func
        .call(this)
        .catch(e => {
          console.error(`Failed loading module ${module.func.name}: ${e.stack || e}`); // eslint-disable-line no-console
          process.exit(1);
        });
    }

    this.log(`${Object.keys(modules).length} modules successfully loaded.`);
  }

  get package () {
    return botPackage;
  }
}

(() => new Tweetcord())();
