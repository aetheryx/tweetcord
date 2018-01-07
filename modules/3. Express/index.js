const express = require('express');
const app = express();
const cookies = require('cookie-parser');
const session = require('express-session');

const routes = require(`${__dirname}/routes`);

function init () {
  this.app = app;

  app.listen(this.config.web.port || 42069, this.log.bind(null, 'Express server ready'));
  app.use(cookies());
  app.use(session({ secret: this.config.web.secret || 'i like bewbies' }));
  // app.use(express.static(__dirname));

  for (const route in routes) {
    routes[route].call(this);
  }

  this.app = app;
}

module.exports = init;