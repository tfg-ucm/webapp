var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MemoryStore = require('memorystore')(session);
var methodOverride = require('method-override');
var config = require('./config/config');

var index = require('./routes/index');
var accounts = require('./routes/accounts');
var beacons = require('./routes/beacons');
var rewards = require('./routes/rewards');
var rewardPoints = require('./routes/rewardPoints');
var routes = require('./routes/routes');

var { isAuthenticated } = require('./middlewares/auth');

var app = express();

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/accounts', accounts);
app.use('/beacons', beacons);
app.use('/beacons/*', beacons);
app.use('/rewards', rewards);
app.use('/reward-points', rewardPoints);
app.use('/reward-points/*', rewardPoints);
app.use('/routes', routes);
app.use('/routes/*', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'There was an error',
    message: err
  });
});

module.exports = app;
