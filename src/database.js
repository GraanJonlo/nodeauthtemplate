var r = require('rethinkdbdash')({
  servers: [
  {host: '127.0.0.2', port: 28015},
  {host: '127.0.0.3', port: 28015}
  ]
});

module.exports = r.db('lonelydevs');
