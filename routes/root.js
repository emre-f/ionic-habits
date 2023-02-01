const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => { // regex: ^/$|/index(.html)? means: /, /index, /index.html works
        res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router