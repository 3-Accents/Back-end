const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: ':clubs: :hearts::spades::diamonds:'
    })
})

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
