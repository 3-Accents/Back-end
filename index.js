const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

const app = express();

const auth = require('./auth');

app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({
        message: ':clubs: :hearts::spades::diamonds:'
    })
});

app.use('/auth', auth)

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.origionalUrl);
    next(error);
}

function errorHandling(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: err.stack
    })
}

const port = process.env.PORT || 3013;
app.listen(port, () => {
    console.log('Fire on port', port);
});
