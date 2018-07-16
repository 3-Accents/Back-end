const passport = require('passport');
const express = require('express');
const FacebookStrategy = require('passport-facebook').Strategy;

const router = express.Router();

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
   console.log(profile);
   
    return cb(null, profile);
  }
));

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['user_friends', 'email'], authType: 'rerequest' }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router; 