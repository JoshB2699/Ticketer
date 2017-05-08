var Ticket = require('../models/ticket.js');
var Users = require('../models/user.js');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
      if(!req.isAuthenticated()){
        res.render('index.ejs');
      } else {
        if (req.user.local.isAdmin) {
          Ticket.find({ 'assigned' : req.user.local.username, 'status' : 'In Progress' }, function(err, t) {
            if (err) {
              throw err;
            } else {
              var tickets = [];

              for (i=0; i < t.length; i++) {
                tickets.push({
                  name : t[i].name,
                  room : t[i].room,
                  desc : t[i].desc
                });
              }
              res.render('adminMain.ejs', {
                  username : req.user.local.username,
                  tickets : tickets,
                  currentPage : 'adminMain',
              });
            }
          });
        } else {
          res.render('nonAdminMain.ejs', {
              username : req.user.local.username,
              currentPage : 'nonAdminMain'
          });
        }
      }
    });

    app.get('/signup', isLoggedIn, function(req, res) {
      if (req.user.local.isAdmin) {
        res.render('signup.ejs', {
          signupMessage: req.flash('signupMessage'),
          username : req.user.local.username,
          currentPage : 'signup'
        });
      } else {
        res.redirect('/');
      }
    });

    app.get('/login', function(req, res) {
      if (req.isAuthenticated()) {
        res.redirect('/');
      } else {
        res.render('login.ejs', {loginMessage: req.flash('loginMessage')});
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
          username : req.user.local.username,
          currentPage : 'createTicket'
      });
    });


    app.post('/createTicket', isLoggedIn, function(req, res){
        var user = req.user;
        var t = new Ticket({
            name: req.body.name,
            room: req.body.room,
            desc: req.body.desc,
            author: user.local.username,
            status: 'Unassigned',
            isArchived: false,
            assigned: ""
        });

        t.save(function(err) {
            if (err)
               throw err;
            else
              req.flash('ticketMessage', 'Ticket Sent');
              res.redirect('/ticketViewer');
        });
    });

    app.get('/changePassword', isLoggedIn, function(req,res){
      res.render('changePassword.ejs', {
        username : req.user.local.username,
        errorMessage: req.flash('info'),
        currentPage : 'changePassword'
      });
    });

    app.post('/changePassword', isLoggedIn, function(req, res){
      if(!req.user.validPassword(req.body.currentPassword)) {
        console.log('Wrong password');
        req.flash('info', 'Incorrect password.');
        res.redirect('/changePassword');
      } else {
        if(req.body.newPassword != req.body.confirmPassword) {
          console.log('Passwords do not match');
          req.flash('info', 'Passwords do not match.');
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
      Ticket.find({'isArchived' : false }, function(err, t) {
        if (err) {
          throw err;
        } else {

          var tickets = [];

          for (i=0; i < t.length; i++) {
              tickets.push({
                name : t[i].name,
                room : t[i].room,
                desc : t[i].desc,
                author : t[i].author,
                id : t[i]._id,
                assigned : t[i].assigned,
                status : t[i].status,
              });
          }

          Users.find({'local.isAdmin' : 'true'}, function(error,u) {
            if (error) {
              throw error;
            } else {
              var technicians = [];

              for (i=0; i < u.length; i++) {
                technicians.push({
                  name : u[i].local.username
                });
              }

              res.render('ticketviewerAdmin.ejs', {
                  username : req.user.local.username,
                  tickets : tickets,
                  technicians : technicians,
                  ticketMessage : req.flash('ticketMessage'),
                  currentPage : 'ticketViewerAdmin',
              });
            }
          });
        }
      });
    } else {
      Ticket.find({ 'author' : user.local.username, 'isArchived' : false }, function(err, t) {
        if (err) {
          throw err;
        } else {
          var tickets = [];

          for (i=0; i < t.length; i++) {
            tickets.push({
              name : t[i].name,
              room : t[i].room,
              desc : t[i].desc,
              author : t[i].author,
              assigned : t[i].assigned,
              status : t[i].status,
            });
          }

          res.render('ticketviewer.ejs', {
              username : req.user.local.username,
              tickets : tickets,
              ticketMessage : req.flash('ticketMessage'),
              currentPage : "ticketViewer"
          });
        }
      });
    }
    });

    app.post('/updateTicket/:id', function(req,res){
      var id = req.params.id;
      var query = {'_id' : id};
      var update;
      if(!req.body.technicianAssigned || (req.body.status == "Completed" && req.body.technicianAssigned) || (req.body.status == "Unassigned" && !req.body.technicianAssigned)) {
        update = {$set: {'name' : req.body.name, 'room' : req.body.room, 'desc' : req.body.desc, 'assigned' : req.body.technicianAssigned, 'status' : req.body.status}};
      } else {
        update = {$set: {'name' : req.body.name, 'room' : req.body.room, 'desc' : req.body.desc, 'assigned' : req.body.technicianAssigned, 'status' : 'In Progress'}};
      }
      Ticket.update(query, update, function(err,doc){
        if (err) {throw err;}
      });
      res.redirect('/ticketViewer');
    });

    app.get('/deleteTicket/:id', isLoggedIn, function(req,res){
      var id = req.params.id;
      var query = {'_id' : id};
      Ticket.remove(query, function(err, result){
          if (err) {
            throw err;
          } else {
            return res.redirect('/ticketViewer');
          }
        }
      );
    });

    app.get('/archiveTicket/:id/:setTo', isLoggedIn, function(req,res){
      if(req.user.local.isAdmin) {
        var id = req.params.id;
        var setTo = req.params.setTo;
        var query = {'_id' : id};
        var update;
        update = {$set: {'isArchived' : setTo }};
        Ticket.update(query, update, function(err,doc){
          if (err) {throw err;}
        });
        res.redirect('/ticketViewer');
      } else {
        res.redirect('/');
      }
    });

    app.get('/archivedTickets', isLoggedIn, function(req,res){
      var user = req.user;

      if (user.local.isAdmin) {
        Ticket.find({ 'isArchived' : true }, function(err, t) {
          if (err) {
            throw err;
          } else {

            var tickets = [];

            for (i=0; i < t.length; i++) {
                tickets.push({
                  name : t[i].name,
                  room : t[i].room,
                  desc : t[i].desc,
                  author : t[i].author,
                  id : t[i]._id,
                  assigned : t[i].assigned,
                  status : t[i].status,
                });
            }

            Users.find({'local.isAdmin' : 'true'}, function(error,u) {
              if (error) {
                throw error;
              } else {
                var technicians = [];

                for (i=0; i < u.length; i++) {
                  technicians.push({
                    name : u[i].local.username
                  });
                }

                res.render('ticketviewerAdmin.ejs', {
                    username : req.user.local.username,
                    tickets : tickets,
                    technicians : technicians,
                    ticketMessage : "",
                    currentPage : "archivedTickets"
                });
              }
            });
          }
        });
      } else {
        Ticket.find({ 'author' : user.local.username, 'isArchived' : true}, function(err, t) {
          if (err) {
            throw err;
          } else {

            var tickets = [];

            for (i=0; i < t.length; i++) {
                tickets.push({
                  name : t[i].name,
                  room : t[i].room,
                  desc : t[i].desc,
                  author : t[i].author,
                  id : t[i]._id,
                  assigned : t[i].assigned,
                  status : t[i].status,
                });
            }

            res.render('ticketviewer.ejs', {
                username : req.user.local.username,
                tickets : tickets,
                ticketMessage : "",
                currentPage : "archivedTickets"
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
