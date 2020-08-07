const path = require('path');

module.exports = {
  entry: {
	  cdb: [ './lib/core/index.js' ]
  },
  mode: 'production',
  output: {
	path: path.resolve(__dirname, "./docs/dist"),
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'var'
  }
};