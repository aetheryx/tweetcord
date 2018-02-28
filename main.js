/**
 *  Tweetcord: A Discord bot that allows you to interact with Twitter
 *  Copyright (C) 2018 Aetheryx (zainalih3c@gmail.com)
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
