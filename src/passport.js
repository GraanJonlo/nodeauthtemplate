var passport = require('passport'),
  LocalStrategy = require('passport-local'),
  users = require('./users'),
  visitors = require('./visitors');

passport.serializeUser(function(user, done) {
  done(null, user.dto.id);
});

passport.deserializeUser(function(id, done) {
  users.get(id)
    .then(function(user) {
      done(null, user);
    })
    .caught(function(err) {
      done(err, null);
    });
});

passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    visitors.get(req.session.visitor)
      .then(function(visitor) {
        visitor.logIn(username, password)
          .then(function(user) {
            return done(null, user);
          })
          .catch(function(err) {
            return done(null, false, req.flash('message', 'Invalid username or password'));
          });
      })
      .catch(function(err) {
        return done(err);
      });
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    var email = req.param('email').trim().toLowerCase(),
      firstName = req.param('firstName'),
      lastName = req.param('lastName');

    visitors.get(req.session.visitor)
      .then(function(visitor) {
        visitor.signUp(username, password, email, firstName, lastName)
          .then(function(user) {
            return done(null, user);
          })
          .catch(function(err) {
            return done(null, false, req.flash('message', 'Unable to create user, maybe they already exist'));
          });
      })
      .catch(function(err) {
        return done(err);
      });
  })
);

module.exports = passport;
