var r = require('rethinkdbdash')({host: '127.0.0.2', port: 28015});

module.exports.users = {
  get: function(id) {
    return r.db('somedb').table('users').get(id).run();
  },
  filter: function(predicate) {
    return r.db('somedb').table('users').filter(predicate).run();
  },
  insert: function(user) {
    return r.db('somedb').table('users').insert(user, {durability: "hard", returnChanges: false, conflict: "error"}).run();
  }
};
