var express = require('express');
var path = require('path');
var React = require('react');
var port = 8080;

app = express();

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');
app.set('views', './server/views');

var indexView = function(req,res) {
  res.render('index.ejs');
};

app.use('/public',
  express.static(path.join(__dirname, '../public'))
);

app.get('*', indexView);

app.listen(port);

console.log('Server is running on port ' + port);
