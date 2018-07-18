const passport = require('passport');
const express = require('express');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db'); // connection to the database
const jwt = require('jsonwebtoken');

const router = express.Router();
const callbackURL = process.env.NODE_ENV === 'production' ? 'https://ante-up.herokuapp.com/auth/facebook/callback' : '/auth/facebook/callback';
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL,
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
        callback(null, user[0]);
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
      const payload = {
        id: user.id,
        facebookId: user.facebookId,
        profilePic: user.profilePic,
        displayName: user.displayName
      };
      jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
      },(err, token) => {
        if (err){
          next(err)
        } else {
          res.cookie('token', token)
          res.redirect('/login.html')
        }
      });
    }
  })(req, res, next);
});

module.exports = router; 