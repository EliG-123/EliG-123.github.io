const express = require('express');
const router = express.Router();


// index will direct to correct sleep page based on your progress
router.get('/', (req, res) => {
    res.render('sleep/index')
})

// First night volume test
router.get('/soundCheck', (req, res) => {
    res.render('sleep/soundCheck', {headerText: 'Sound Check'})
})

// First night cue training
router.get('/training', (req,res) => {
    res.render('sleep/training',  {headerText: 'Training'} )
})

// Following nights cueing
router.get('/sleep', (req, res) => {
    res.render('sleep/sleep',  {headerText: 'Sleep'})
})

module.exports = router 