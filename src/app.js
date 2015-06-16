var bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  express = require('express'),
  favicon = require('serve-favicon'),
  flash = require('connect-flash'),
  logger = require('morgan'),
  path = require('path'),
  sassMiddleware = require('node-sass-middleware'),
  useragent = require('express-useragent'),
  bus = require('./messageBus'),
  passport = require('./passport'),
  routes = require('./routes/index'),
  session = require('./session'),
  visitors = require('./visitors'),
  app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(useragent.express());

app.use(sassMiddleware({
  src: __dirname + '/sass',
  dest: __dirname + '/public/stylesheets',
  debug: true,
  outputStyle: 'expanded',
  prefix: '/stylesheets'
}));

app.use(express.static(__dirname + '/public'));

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  if (!req.session.visitor && req.accepts('html')) {
    visitors.create(req)
      .then(function(visitor) {
        req.session.visitor = visitor.getId();
        next();
      })
      .catch(function(err) {
        // Should probably do something
        next();
      });
  } else {
    next();
  }
});

app.use('/', routes);

module.exports = app;
