var express = require('express');
var session = require('express-session');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var port = process.env.PORT || 8080;

var passport = require('passport');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var morgan   = require('morgan');
var configDB = require('./config/database.js');

require('./config/passport')(passport); // pass passport for configuration
mongoose.connect(configDB.url); // connect to our database

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./config/routes.js')(app, passport);

app.listen(port);
console.log('Ticketer is running on port ' + port);
