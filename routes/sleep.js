const express = require('express');
const { serializeUser } = require('passport');
const router = express.Router();

const User = require('../models/account');

const progLinks = {
  'questionnaire': '/surveys',
  'soundcheck': '/sleep/soundCheck',
  'training': '/sleep/training',
  'sleeping': '/sleep/sleeping'
}


// index will direct to correct sleep page based on your progress
router.get('/', checkAuthenticated, checkNotAnswered, async (req, res) => {
  let ou = await checkProgress(req, res)

    res.render('sleep/index', {
      headerText: 'Sleep',
      nextpg: progObj['nxtpg'],
      nxtLink: progLinks[progObj['nxtpg']]
    })
})

// First night volume test
router.get('/soundCheck', checkAuthenticated,  checkNotAnswered, checkSoundChecked, (req, res) => {
    res.render('sleep/soundCheck', {headerText: 'Sound Check'})
})

// First night cue training
router.get('/training', checkAuthenticated, checkNotAnswered, checkNotSoundChecked, (req, res) => {
    const _id = req.session.passport.user
    User.findOne({ _id }, (err, results) => {
        if (err) {
          throw err;
        }
        res.render('sleep/training', {headerText:'Training', vols: [results.vol1, results.vol2]})
    })
})

router.get('/sleeping', checkAuthenticated, checkNotAnswered, checkNotSoundChecked, checkTrained,  (req, res) => {
  const _id = req.session.passport.user
  User.findOne({ _id }, (err, results) => {
      if (err) {
        throw err;
      }
      res.render('sleep/training', {headerText:'Training', vols: [results.vol1, results.vol2]})
  })
})

router.post('/training', checkAuthenticated, async (req, res) => {
  console.log('posted to training')
    try {
      const _id = req.session.passport.user
      const filter = { _id: _id };
      const volStr = req.body.volObjFrm
      const volArr = volStr.split(",")
      const vol1 = parseFloat(volArr[0])
      const vol2 = parseFloat(volArr[1])
      console.log(vol1, vol2)
      const updateDoc = {
          $set: {
              vol1: vol1,
              vol2: vol2
          }
      }
      const result = await User.updateOne(filter, updateDoc, {upsert:true, new:true})
      console.log(result)
      User.findOne({ _id }, (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.vol1)
          res.render('sleep/training', {headerText:'Training', vols: [results.vol1, results.vol2]})
      })
    } catch (e){
        console.log(e)
        res.redirect('/')
    }
})


function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')

}

async function checkSoundChecked (req, res, next) { 
    const _id = req.session.passport.user
    await User.findOne({_id }, async (err, results) => {
        if (err) {
          throw err
        }
        if (results.vol1) {
           return res.render('sleep/training',  {headerText:'Training', vols: [results.vol1, results.vol2]})
        } else {
            return next()
        }
    }).clone()
}

async function checkNotSoundChecked (req, res, next) {                                                       
    const _id = req.session.passport.user
    await User.findOne({_id }, async (err, results) => {
        if (err) {
          throw err
        }
        if (!results.vol1) {
           return res.render('sleep/soundCheck',  {headerText:'Soundcheck'})
        } else {
            return next()
        }
    }).clone()
}

async function checkNotSoundChecked (req, res, next) {                                                       
  const _id = req.session.passport.user
  await User.findOne({_id }, async (err, results) => {
      if (err) {
        throw err
      }
      if (!results.vol1) {
         return res.render('sleep/soundCheck',  {headerText:'Soundcheck'})
      } else {
          return next()
      }
  }).clone()
}

  function checkNotAnswered(req, res, next) {
    const _id = req.session.passport.user
    User.findOne({_id}, (err, results) => {
      if (err) {
        throw err
      } 
      if (!results.q1a) {
        return res.redirect('surveys/')
      } else {
        return next()
      }
    })
  }

  function checkTrained (req, res, next) {
    const _id = req.session.passport.user
    User.findOne({_id}, (err, results) => {
      if (err) {
        throw err
      } 
      if (results.day > 0) {
        return next ()
      } else {
        return res.redirect('/sleep')
      }
    })
  }

  async function checkProgress (req, res) {
    try {
      const _id = req.session.passport.user
      console.log('id')
      await User.findOne({_id }, async (err, results) => {
        if (err) {
          throw err
        }
        progObj = { //global variable, i know i know, bad form but idk how to return it!
        }
        if (results.q1a) {
          if (results.vol1) {
            if (results.day == 1) {
              progObj['nxtpg'] = 'training'
            } else {
              progObj['nxtpg'] = 'sleeping'
            }
            
          } else {
            progObj['nxtpg'] = 'soundcheck'
          }
        } else {
          progObj['nxtpg'] = 'questionnaire'
        }
      }).clone();
    } catch (e) {
      return 'not authenticated'
    }
  }
  


module.exports = router 