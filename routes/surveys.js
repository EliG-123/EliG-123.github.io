const express = require('express');
const router = express.Router();
const Survey = require('../models/survey')


// Begin Survey Page
router.get('/', (req, res) => {
    res.render('surveys/index')
})

// Take survey page
router.get('/take', (req, res) => {
    res.render('surveys/take', { headerText: "Take Survey", survey : new Survey() })
})

// "Create author route?""
router.post('/', (req, res) => {
    res.send('Answers?')
})


module.exports = router 