// set up ======================================================================
var express  = require('express');
var app      = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var port = process.env.PORT || 3000;
var authConfig = require('./api/auth');
var mongoose = require('mongoose');

// establish connection with database
mongoose.connect('mongodb://localhost:27017/github');
mongoose.Promise = require('bluebird');


//log every request to the console
app.use(morgan('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'false'}));

// parse application/json
app.use(bodyParser.json());

// read cookies (needed for auth)
app.use(cookieParser());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// required for passport
app.use(cookieSession({
  name: 'session',
  keys: ['authSessionKey'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: false
}))

app.use(passport.initialize());
app.use(passport.session());

 // load the routes
require('./api/passport')(passport); // pass passport for configuration
require('./api/routes')(app, passport);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
