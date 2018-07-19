const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

require('dotenv').config(); //loads all variables in env file to our environment

const app = express();

const middlewares = require('./auth/middlewares');
const auth = require('./auth');
const api = require('./api');

app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(passport.initialize()); //initialize?
app.use(middlewares.checkHeaderSetUser);

app.get('/', (req, res) => {
  res.json({
    message: '♣ ♠ ♦ ♥',
    user: req.user
  });
});

app.use('/auth', auth);
app.use('/api/v1', middlewares.isLoggedIn, api);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.origionalUrl);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandling(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

app.use(notFound);
app.use(errorHandling);

const port = process.env.PORT || 3013;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log('Fire on port', port);
});
