let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//create the user Model instance
let userModel = require('../Models/user');
let User = userModel.User; // alias

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Complexity', displayName: req.user ? req.user.displayName : '' });
});
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Complexity', displayName: req.user ? req.user.displayName : '' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', displayName: req.user ? req.user.displayName : '' });
});

router.get('/survey', function(req, res, next) {
res.render('survey/survey', { title: 'Survey List', displayName: req.user ? req.user.displayName : '' });
});


router.get('/login', (req, res, next) => {
  //check if the user is already logged in
  if(!req.user)
  {
      res.render('auth/login',
      {
      title: "Login",
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
      });
  }
  else
  {
      return res.redirect('/');
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
      // server error?
      if(err)
      {
          return next(err);
      }
      // is there a user login error?
      if(!user)
      {
          req.flash('loginMessage', 'Authentication Error');
          return res.redirect('/login');
      }
      req.login(user, (err) => {
          // server error?
          if(err)
          {
              return next(err);
          }
          return res.redirect('/survey-list');
      });
  })(req, res, next)});

router.get('/register', (req, res, next) => {
  //check if the user is not already logged in
  if(!req.user)
  {
      res.render('auth/register',
      {
          title: 'Register',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ""
      });
  }
  else
  {
      return res.redirect('/');
  }
});

router.post('/register', (req, res, next) => {
  //instantiate a user object
  let newUser = new User({
      username: req.body.username,
      //password: req.body.password,
      email: req.body.email,
      displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
      if(err)
      {
          console.log("Error: Inserting New User");
          if(err.name == "UserExistsError")
          {
              req.flash(
                  'registerMessage',
                  'Registration Error: User Already Exists!'
              );
              console.log('Registration Error: User Already Exists!')
          }
          return res.render('auth/register',
          {
              title: 'Register',
              messages: req.flash('registerMessage'),
              displayName: req.user ? req.user.displayName : ""
          });
      }
      else
      {
          // if no error exists, then  registration is successful

          // redirect the user and authenticate them

          return passport.authenticate('local')(req, res, () => {
              res.redirect('/survey-list');
          });
      }
  });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;