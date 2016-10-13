var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 8080;

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var routes = require('./config/routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', routes.indexView);
app.get('/login', routes.loginView);
app.get('/loginerror', routes.loginerrorView);
app.get('/main', routes.mainView);
app.get('/signup', routes.signupView);
app.get('/createTicket', routes.ticketformView);

app.listen(port);
console.log('Server is running on port ' + port);
