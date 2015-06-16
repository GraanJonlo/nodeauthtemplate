var expressSession = require('express-session'),
  RedisStore = require('connect-redis')(expressSession),
  sessionSecret = process.env.SESSION_SECRET || 'replace this with something better',
  redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    db: parseInt(process.env.REDIS_DB || 1)
  };

if (process.env.REDIS_PASS) {
  redisOptions.pass = process.env.REDIS_PASS;
}

module.exports = expressSession({
  store: new RedisStore(redisOptions),
  secret: sessionSecret,
  name: 'lonelydevs.sid',
  resave: true
});
