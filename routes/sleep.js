const express = require('express');
const { serializeUser } = require('passport');
const router = express.Router();

const User = require('../models/account');



// index will direct to correct sleep page based on your progress
router.get('/', checkAuthenticated, (req, res) => {
    res.render('sleep/index')
})

// First night volume test
router.get('/soundCheck',checkAuthenticated, (req, res) => {
    res.render('sleep/soundCheck', {headerText: 'Sound Check'})
})

// First night cue training
router.get('/training', checkAuthenticated, (req,res) => {
    res.render('sleep/training',  {headerText: 'Training'} )
})

router.post('/training', checkAuthenticated,  async (req, res) => {
    try {
        const filter = { _id: req.session.passport.user };
        const updateDoc = {
            $set: {
                vol1: req.body.volObjFrm[0],
                vol2: req.body.volObjFrm[0]
            }
        }
        const result = await User.updateOne(filter, updateDoc)
        console.log(result)
        res.render('sleep/training', {vols: req.body.volObjFrm})
    } catch {
        res.redirect('/')
    }
})

// Following nights cueing
router.get('/sleep', checkAuthenticated, (req, res) => {
    res.render('sleep/sleep',  {headerText: 'Sleep'})
})


function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')

}


module.exports = router 