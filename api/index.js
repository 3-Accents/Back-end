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

router.get('/bets/:id', (req, res, next) => {
  db('bets')
    .where('id', req.params.id)
    .first()
    .then(bet => {
      if (bet && (bet.receiverId === req.user.id || bet.creatorId === req.user.id)) {
        res.json(bet);
      } else {
        const error = new Error('Not Found');
        res.status(404);
        next(error);
      }
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

router.get('/bets', (req, res, next) => {
  db('bets')
    .where('receiverId', req.user.id)
    .orWhere('creatorId', req.user.id)
    .then(bets => {
      const categories = {
        active: [],
        pending: [],
        incoming: [],
        completed: [],
        void: [],
        voting: [],
        conflicted: [],
        myBad: []
      };

      const now = Date.now();
      bets.forEach(bet => {
        const betStart = +bet.startDate;
        const betEnd = +bet.endDate;
        //Pending and incoming are always going to be broken until we have other users. 
        //Currently the creatorId and receiverId are the same and that breaks it. 
        //We cannot get anything into conflicted because there arent any other id's to vote for other than ID 1 (everything goes to voting).
        if (betStart > now && !bet.receiverAccepted) {
          //pending is any bet where the receiver has not accepted it and the startdate is after the current date
          categories.pending.push(bet);
        } 
        else if (betStart > now && bet.receiverId === req.user.id && !bet.receiverAccepted){
          //incoming is any bet where the receiver id is equal to the current user id and they havent accepted it and the start date is after the current date
          categories.incoming.push(bet);
        } 
        else if (betStart < now && now < betEnd && bet.receiverAccepted) {
          //active is any bet where the current date falls between start and end date and is accepted
          categories.active.push(bet);
        } 
        else if (betStart < now && !bet.receiverAccepted){
          //void is any bet where the current date is after the start date where the receiver has not accepted it
          categories.void.push(bet);
        } 
        else if (betEnd <= now && bet.receiverAccepted && (!bet.receiverVoteWinner || !bet.creatorVoteWinner)) {
          //voting is any bet where the receiver has accepted, winner is undetermined, and the end date has passed
          categories.voting.push(bet);
        } 
        else if (betEnd < now && bet.receiverAccepted && bet.receiverVoteWinner && bet.creatorVoteWinner && bet.receiverVoteWinner !== bet.creatorVoteWinner){
          //conflicted is any bet where the receiver is has accepted and a winner votes do not match and the end date has passed
          categories.conflicted.push(bet);
        } 
        else if (betEnd < now && bet.receiverAccepted && bet.receiverVoteWinner && bet.creatorVoteWinner && bet.receiverVoteWinner === bet.creatorVoteWinner) {
          //completed is any bet where is receiver has accepted and a winner has been determined and the end date has passed
          categories.completed.push(bet);
        } 
        else {
          categories.myBad.push(bet);
        }
      }); 
      res.json(categories);
    }).catch(next);
  
});

module.exports = router;
