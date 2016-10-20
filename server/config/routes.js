// var passport = require('passport');
//
// var indexView = function(req,res){
//   res.render('index.ejs');
// };
//
// var loginView = function(req,res){
//   res.render('login.ejs');
// };
//
// var loginerrorView = function(req,res){
//   res.render('loginerror.ejs');
// };
//
// var mainView = function(req,res){
//   res.render('main.ejs');
// };
//
// var signupView = function(req,res){
//   res.render('signup.ejs');
// };
//
// var ticketformView = function(req,res){
//   res.render('ticketform.ejs');
// };
//
// var signupPost =  passport.authenticate('local-signup', {
//         successRedirect : '/main', // redirect to the secure profile section
//         failureRedirect : '/signup', // redirect back to the signup page if there is an error
//         failureFlash : true // allow flash messages
// });
//
// var loginPost =  passport.authenticate('local-login', {
//             successRedirect : '/main', // redirect to the secure section
//             failureRedirect : '/login', // redirect back to the login page if there is an error
//             failureFlash : true // allow flash messages
// });
//
// exports.indexView = indexView;
// exports.loginView = loginView;
// exports.loginerrorView = loginerrorView;
// exports.mainView = mainView;
// exports.signupView = signupView;
// exports.ticketformView = ticketformView;
// exports.signupPost = signupPost;
// exports.loginPost = loginPost;

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      if(!req.isAuthenticated())
        res.render('index.ejs');
      else
        res.render('main.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.get('/signup', isLoggedIn, function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));

     app.post('/login', passport.authenticate('local-login', {
         successRedirect : '/',
         failureRedirect : '/login',
         failureFlash : true
     }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/createTicket', isLoggedIn, function(req,res){
      res.render('ticketform.ejs');
    });

    app.post('/createTicket');



  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
      res.redirect('/login');
  }
};
