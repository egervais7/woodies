var express = require('express');
var db = require('../models');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

// set up signup route
router.route('/signup')
  .get(function(req, res) {
    res.render('auth/signup');
  })
  .post(function(req, res) {
    if(req.body.password != req.body.password2) {
      req.flash('danger', 'Passwords do not match');
      res.redirect('/auth/signup');
    } else {
      db.user.findOrCreate({
        where: {username: req.body.email},
        defaults: {
          password: req.body.password,
          name: req.body.name
        }
      }).spread(function(user, created){
        if (created) {
          req.login(user, function(err){
            if(err) throw err;
            req.flash('success', 'You are signed up and logged in!');
            res.redirect('/');
          });
        } else {
          req.flash('danger', 'A user with the email already exists.');
          res.redirect('/auth/signup');
        }
      }).catch(function(err) {
        req.flash('danger', 'Error');
        res.redirect('/auth/signup');
      });
    }
  });

// set up login route
  router.route('/login')
    .get(function(req, res) {
      res.render('auth/login');
    })
    .post(function(req, res) {
      passport.authenticate('local', function(err, user, info) {
        if(user) {
          req.session.user = user.id;
          req.login(user, function(err) {
            if(err) throw err;
            req.flash('success', 'You are now logged in!');
            res.redirect('/');
          });
        } else {
          req.flash('danger', 'Error');
          res.redirect('/auth/login');
        }
      })(req, res);
    });

// request for login through pinterst.  OAuth fun
  router.get('/login/:provider', function(req, res) {
    passport.authenticate(
      req.params.provider,
      {scope: ['read_public', 'read_relationships']}
  )(req, res);
  });

// callback from login through pinterest
  router.get('/callback/:provider', function(req, res) {
    passport.authenticate(req.params.provider, function(err, user, info){
      if (err) throw err;
      if (user) {
        req.login(user, function(err){
          if(err) throw err;
          req.flash('success', 'You are now logged in with ' + req.params.provider);
          res.redirect('/');
        });
      } else {
        req.flash('danger', 'Error');
        res.redirect('/auth/login');
      }
    })(req, res);
  });

//for user log out
  router.get('/logout', function(req, res){
    req.logout();
    req.flash('info', 'You are now logged out.');
    res.redirect('/');
  });

  module.exports = router;
