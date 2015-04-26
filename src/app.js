var bcrypt = require('bcrypt-nodejs'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  express = require('express'),
  expressSession = require('express-session'),
  favicon = require('static-favicon'),
  flash = require('connect-flash'),
  LocalStrategy = require('passport-local'),
  logger = require('morgan'),
  passport = require('passport'),
  path = require('path'),
  RedisStore = require('connect-redis')(expressSession),
  uuid = require('node-uuid'),
  routes = require('./routes/index'),
  repos = require('./repositories'),
  app = express(),
  redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    db: parseInt(process.env.REDIS_DB || 1)
  },
  hashRounds = parseInt(process.env.HASH_ROUNDS || 12),
  sessionSecret = process.env.SESSION_SECRET || 'replace this with something better';

if (process.env.REDIS_PASS) {
  redisOptions.pass = process.env.REDIS_PASS;
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  repos.Users.get(id)
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
    repos.Users.filter({ 'username': username })
      .then(function(matches) {
        var user;

        if (matches.length === 0) {
          return done(null, false, req.flash('message', 'User not found.'));
        }

        user = matches[0];

        if (!isValidPassword(user, password)) {
          return done(null, false, req.flash('message', 'Invalid Password'));
        }

        return done(null, user);
      })
      .caught(function(err) {
        return done(err);
      });
}));

function isValidPassword(user, password){
  return bcrypt.compareSync(password, user.password);
}

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      repos.Users.filter({ "username": username })
        .then(function(matches) {
          var newUser;

          if (matches.length > 0) {
            return done(null, false, req.flash('message','User already exists'));
          }

          newUser = {
            "id": uuid.v4(),
            "username": username,
            "password": createHash(password),
            "email": req.param('email'),
            "firstName": req.param('firstName'),
            "lastName": req.param('lastName')
          };

          repos.Users.insert(newUser)
            .then(function() {
              return done(null, newUser);
            })
            .caught(function(err) {
              throw err;
            });
        })
        .caught(function(err) {
          return done(err);
        });
    };

    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);

function createHash(password){
 return bcrypt.hashSync(password, bcrypt.genSaltSync(hashRounds), null);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(flash());
app.use(express.static(__dirname + '/public'));

app.use(expressSession({
  store: new RedisStore(redisOptions),
  secret: sessionSecret,
  name: 'nodeauthtemplate.sid',
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

module.exports = app;
