var Ticket = require('../models/ticket.js');
var Users = require('../models/user.js');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      if(!req.isAuthenticated()){
        res.render('index.ejs');
      } else {
        if (req.user.local.isAdmin) {
          res.render('adminMain.ejs', {
              username : req.user.local.username
          });
        } else {
          res.render('nonAdminMain.ejs', {
              username : req.user.local.username
          });
        }
      }
    });

    app.get('/signup', isLoggedIn, function(req, res) {
      if (req.user.local.isAdmin) {
        res.render('signup.ejs', {
          message: req.flash('signupMessage'),
          username : req.user.local.username
        });
      } else {
        res.redirect('/');
      }
    });

    app.get('/login', function(req, res) {
      if (req.isAuthenticated()) {
        res.redirect('/');
      } else {
        res.render('login.ejs');
      }
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
      res.render('ticketform.ejs', {
          username : req.user.local.username
      });
    });


    app.post('/createTicket', isLoggedIn, function(req, res){
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
               res.redirect('/');
        });
    });

    app.get('/changePassword', isLoggedIn, function(req,res){
      res.render('changePassword.ejs', {
        username : req.user.local.username,
        message: req.flash('info')
      });
    });

    app.post('/changePassword', isLoggedIn, function(req, res){
      if(!req.user.validPassword(req.body.currentPassword)) {
        console.log('Wrong password');
        req.flash('info', 'Password incorrect!');
        res.redirect('/changePassword');
      } else {
        if(req.body.newPassword != req.body.confirmPassword) {
          console.log('Passwords do not match');
          $.flash('Passwords do not match');
          res.redirect('/changePassword');
        } else {
          var query = {'local.username' : req.user.local.username};
          var update = {$set: {'local.password' : req.user.generateHash(req.body.newPassword)}};
          Users.update(query, update, function(err,doc){
            if (err) {throw err;}
          });
          res.redirect('/');
        }
      }
    });




    app.get('/ticketViewer', isLoggedIn, function(req,res){
      var user = req.user;

      if (user.local.isAdmin) {
      Ticket.find(function(err, t) {
        if (err) {
          throw err;
        } else {

          var tickets = [];

          for (i=0; i < t.length; i++) {
            tickets.push({
              name : t[i].name,
              room : t[i].room,
              desc : t[i].desc,
              author : t[i].author
            });
          }

          res.render('ticketviewer.ejs', {
              username : req.user.local.username,
              tickets : tickets,
          });
        }
      });
    } else {
      Ticket.find({ 'author' : user.local.username }, function(err, t) {
        if (err) {
          throw err;
        } else {

          var tickets = [];

          for (i=0; i < t.length; i++) {
            tickets.push({
              name : t[i].name,
              room : t[i].room,
              desc : t[i].desc,
              author : t[i].author
            });
          }

          res.render('ticketviewer.ejs', {
              username : req.user.local.username,
              tickets : tickets,
          });
        }
      });
    }
    });

    app.get('*', function(req,res){
      res.redirect('/');
    });

  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
      res.redirect('/login');
  }
};
