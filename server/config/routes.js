var Ticket   = require('../models/ticket.js');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      if(!req.isAuthenticated()){
        res.render('index.ejs');
      } else {
        res.render('main.ejs', {
            user : req.user // get the user out of session and pass to template
        });
      }
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


    app.post('/createTicket', function(req, res){
        var user = req.user;
        var t = new Ticket({
            name: req.body.name,
            room: req.body.room,
            desc: req.body.desc,
            author: user.local.username,
        });

        t.save(function(err) {
            if (err)
               throw err;
            else
               console.log('Ticket saved successfully.');
        });
    });

    app.get('/ticketViewer', function(req,res){
      res.render('ticketviewer.ejs');
    });

  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
      res.redirect('/login');
  }
};
