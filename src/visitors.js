var Promise = require('bluebird'),
  uuid = require('node-uuid'),
  bus = require('./messageBus'),
  db = require('./database'),
  credentials = require('./credentials'),
  users = require('./users'),
  Visitor = function(dto) {
    this.dto = dto;
  };
  Visitor.prototype.getId = function() {
    return this.dto.id;
  };
  Visitor.prototype.logIn = function(username, password) {
    return new Promise(function (resolve, reject) {
      credentials.get(username)
      .then(function(creds) {
        if (!creds.isValidPassword(password)) {
          reject('Invalid username or password');
        }
        users.get(username)
          .then(function(user) {
            bus.emit("visitorLoggedInAs", this, user);
            resolve(user);
          })
          .catch(function(err) {
            reject(err);
          });
      })
      .catch(function(err) {
        return reject(err);
      });
    });
  };
  Visitor.prototype.signUp = function(username, password, email, firstName, lastName) {
    return new Promise(function (resolve, reject) {
      credentials.create(username, password, email)
      .then(function(creds) {
        users.create(username, email, firstName, lastName)
          .then(function (user) {
            bus.emit("visitorSignedUpAs", this, user);
            resolve(user);
          })
          .catch(function(err) {
            reject(err);
          });
      })
      .catch(function() {
        reject(err);
      });
    });
  };

bus.on("visitorCreated", function(visitor) {
  db.table('visitors')
    .insert(visitor.dto, { durability: "hard", returnChanges: false, conflict: "error" })
    .run()
    .then(function() {
      // nada
    })
    .catch(function(err) {
      throw err;
    });
});

module.exports = {
  create: function(req) {
    return new Promise(function (resolve, reject) {
      try {
        var visitor = new Visitor({
          'id': uuid.v4(),
          'referrer': req.originalUrl.toLowerCase(),
          'ipAddress': req.ip,
          'timestamp': Date.now(),
          'formattedTimestamp': new Date().toISOString(),
          'useragent': req.useragent
        });

        bus.emit("visitorCreated", visitor);

        resolve(visitor);
      } catch (e) {
        reject(e);
      }
    });
  },
  get: function(id) {
    return new Promise(function (resolve, reject) {
      db.table('visitors').get(id).run()
        .then(function(dto) {
          resolve(new Visitor(dto));
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
};
