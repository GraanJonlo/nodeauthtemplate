var express = require('express'),
  passport = require('passport'),
  router = express.Router();

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
    
  res.redirect('/signin');
}

router.get('/signin', function(req, res) {
  res.render('signin', {
    message: req.flash('message'),
    title: 'Signin'
  });
});

router.get('/', isAuthenticated, function(req, res){
  res.render('home', {
    message: req.flash('message'),
    title: 'Home',
    user: req.user
  });
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash : true 
}));

router.get('/signup', function(req, res){
  res.render('register',{
    message: req.flash('message'),
    title: 'Signup'
  });
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash : true 
}));

router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/signin');
});

module.exports = router;
