const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
  res.json({
    message: 'Ante-Up API'
  });
});

router.get('/friends', (req, res, next) => {
  db('users')
    .select('id', 'displayName', 'profilePic')
    .then(users => {
      res.json(users);
    }).catch(next);
});

router.post('/bets', (req, res, next) => {
  req.body.creatorId = req.user.id;
  db('bets')
    .insert(req.body, '*')
    .then(bets => {
      res.json(bets[0]);
    }).catch(next);
});

router.get('/bets', (req, res) => {
  res.json({
    active: [],
    pending: [],
    incoming: [],
    completed: []
  });
});

module.exports = router;
