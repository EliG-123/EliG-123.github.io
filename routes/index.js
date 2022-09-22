const express = require('express')
const router = express.Router();
const passport = require("passport")
const methodOverride = require('method-override')
const session = require('express-session')

const User = require('../models/account');



router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'))

const progLinks = {
  'questionnaire': '/surveys',
  'soundcheck': '/sleep/soundCheck',
  'training': '/sleep/training',
  'sleep' : 'sleep/training'
}

const dayLinks = {

}

router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      await checkProgress(req, res)
      res.render('index.ejs', {
        buttonName:'My Account', 
        auth:true, 
        nxtpg:progObj['nxtpg'],
        nxtLink:progLinks[progObj['nxtpg']]})
    } else {
      res.render('index.ejs', {buttonName:'Log In', auth:false})
    }
  } catch {
    console.log('caught')
    res.render('index.ejs', {buttonName:'Log In', auth:false})
  }
})

router.post('/logout', function(req, res){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  async function checkProgress (req, res) {
    console.log('checking')
    try {
      console.log('iffing')
      const _id = req.session.passport.user
      console.log('id')
      await User.findOne({_id }, async (err, results) => {
        console.log('found')
        if (err) {
          throw err
        }
        progObj = { //global variable, i know i know, bad form but idk how to return it!
        }
        if (results.q1a) {
          if (results.vol1) {
            progObj['nxtpg'] = 'training'
          } else {
            progObj['nxtpg'] = 'soundcheck'
          }
        } else {
          progObj['nxtpg'] = 'questionnaire'
        }
      }).clone();
    } catch (e) {
      console.log('caught', e)
      return null
    }
  }

module.exports = router 