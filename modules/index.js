module.exports = require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .map(module => require(`${__dirname}/${module}`));
