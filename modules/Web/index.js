const express = require('express');
const app = express();
const session = require('express-session');

const routes = require(`${__dirname}/routes`);

async function createWeb () {
  this.app = app;

  this.server = app.listen(this.config.web.port || 42069, this.log.bind(null, 'Express server ready'));
  app.use(session({
    secret: this.config.web.secret || 'i like bewbies',
    saveUninitialized: true,
    resave: false
  }));

  app.use(express.static(`${__dirname}/views`));

  for (const route in routes) {
    routes[route].call(this);
  }
}

module.exports = {
  order: 4,
  func: createWeb
};
