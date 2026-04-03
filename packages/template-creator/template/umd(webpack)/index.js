if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/bundle.min.js');
} else {
  module.exports = require('./lib/bundle.js');
}