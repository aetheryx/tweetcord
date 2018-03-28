const { join } = require('path');

module.exports = {
  mode: 'development',
  entry: [ './modules/Web/views/src/App.jsx' ],
  output: {
    path: join(__dirname, 'modules', 'Web', 'views'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js']
  }
};
