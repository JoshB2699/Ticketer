var indexView = function(req,res){
  res.render('index.ejs');
};

var loginView = function(req,res){
  res.render('login.ejs');
};

var loginerrorView = function(req,res){
  res.render('loginerror.ejs');
};

var mainView = function(req,res){
  res.render('main.ejs');
};

var signupView = function(req,res){
  res.render('signup.ejs');
};

var ticketformView = function(req,res){
  res.render('ticketform.ejs');
};

exports.indexView = indexView;
exports.loginView = loginView;
exports.loginerrorView = loginerrorView;
exports.mainView = mainView;
exports.signupView = signupView;
exports.ticketformView = ticketformView;
