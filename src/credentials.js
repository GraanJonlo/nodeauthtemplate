var bcrypt = require('bcrypt-nodejs'),
  Promise = require('bluebird'),
  bus = require('./messageBus'),
  db = require('./database'),
  hashRounds = parseInt(process.env.HASH_ROUNDS || 12),
  Credentials = function(dto) {
    this.dto = dto;
  };
  Credentials.prototype.getId = function() {
    return this.dto.id;
  };
  Credentials.prototype.isValidPassword = function(password) {
    return this.dto !== null && bcrypt.compareSync(password, this.dto.password);
  };

bus.on("credentialsCreated", function(credentials) {
  db.table('credentials')
    .insert(credentials.dto, { durability: "hard", returnChanges: false, conflict: "error" })
    .run()
    .then(function() {
      // nada
    })
    .catch(function(err) {
      throw err;
    });
});

function createHash(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(hashRounds), null);
}

module.exports = {
  create: function(username, password, email) {
    return new Promise(function(resolve, reject) {
      var credentials = new Credentials({
        'id': username,
        'password': createHash(password),
        'email': email
      });

      try {
        bus.emit("credentialsCreated", credentials);
        resolve(credentials);
      } catch (e) {
        reject(e);
      }
    });
  },
  get: function(id) {
    return new Promise(function (resolve, reject) {
      db.table('credentials').get(id).run()
        .then(function(dto) {
          resolve(new Credentials(dto));
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
};
