const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Ante-Up API'
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
