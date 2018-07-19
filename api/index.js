const express = require('express');
const router = express.Router();
const db = require('../db');




router.get('/', (req, res) => {
  res.json({
    message: 'Ante-Up API'
  });
});

router.get('/friends', (req, res) => {
  db('users')
    .select('id', 'displayName', 'profilePic')
    .then(users => {
      res.json(users);
    });
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
