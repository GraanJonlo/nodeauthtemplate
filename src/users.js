var Promise = require('bluebird'),
  crypto = require('crypto'),
  db = require('./database'),
  bus = require('./messageBus'),
  User = function(dto) {
    this.dto = dto;
  };
  User.prototype.getId = function() {
    return this.dto.id;
  };
  User.prototype.updateAbout = function(newText) {
    this.dto.about = newText;
    bus.emit("aboutUpdated", this);
  };

bus.on("userCreated", function(user) {
  db.table('users')
    .insert(user.dto, { durability: "hard", returnChanges: false, conflict: "error" })
    .run()
    .then(function() {
      // nada
    })
    .catch(function(err) {
      throw err;
    });
});

bus.on("aboutUpdated", function(user) {
  db.table('users').get(user.getId()).update({ "about": user.dto.about }, { durability: "soft" , returnChanges: false })
    .then(function() {
      // do what?
    })
    .catch(function(err) {
      // do what?
    });
});

module.exports = {
  create: function(username, email, firstName, lastName) {
    return new Promise(function(resolve, reject) {
      var user = new User({
          "id": username,
          "email": email,
          "firstname": firstName,
          "lastname": lastName,
          "gravatarhash": crypto.createHash('md5').update(email, 'utf8').digest('hex'),
          "about": "",
          "have": [],
          "want": []
        });

      try {
        bus.emit("userCreated", user);
        resolve(user);
      } catch (e) {
        reject(e);
      }
    });
  },
  get: function(id) {
    return new Promise(function (resolve, reject) {
      db.table('users').get(id).run()
        .then(function(dto) {
          resolve(new User(dto));
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
};
