const passport = require('passport');
const express = require('express');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db'); // connection to the database

const router = express.Router();

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, callback) {
    const fbUser = {
      facebookId: profile.id,
      email: profile.emails[0].value,
      profilePic: profile.photos[0].value,
      displayName: profile.displayName,
      accessToken,
    };
    // search the database for user with this facebookId
    db('users')
      .where('facebookId', fbUser.facebookId)
      .first()
      .then(user => {
        if (user) {
          //update user in db 
          return db('users')
            .where('facebookId', fbUser.facebookId)
            .update(fbUser, '*')
      
        } else {
          //insert user into db. knex syntax?
          return db('users')
            .insert(fbUser, '*')
        }
      }).then(user => {
        callback(null, user);
      }).catch(error => {
        callback(error);
      });
  }
));

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['user_friends', 'email'], authType: 'rerequest' }));

router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (error, user) => {
    if (error) {
      return next(error);
    } else {
      res.json(user);
    }
  })(req, res, next);
});

module.exports = router; 