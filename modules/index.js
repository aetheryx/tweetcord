require('fs').readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .map(module => {
    exports[module] = require(`${__dirname}/${module}`);
  });