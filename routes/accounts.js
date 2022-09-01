if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

 
const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport")
const localStrategy = require('passport-local').Strategy

const progLinks = {
  'questionnaire': '/surveys',
  'soundcheck': '/sleep/soundCheck',
  'training': '/sleep/training',
}

const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require("../passport-config")
const User = require('../models/account');


initializePassport(
    passport, 
    id => User.findOne({id: id} )
)

// Again, before I break. this worked
// initializePassport(
//   passport, 
//   id => User.findOne({id: id})
// )


router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

router.use(passport.session())

router.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(methodOverride('_method'))

router.get("/", checkAuthenticated, async (req, res) => {
  let ou = await checkProgress(req, res)
  console.log(progObj, progLinks[progObj['nxtpg']])
  const _id = req.session.passport.user
  User.findOne({ _id }, (err, results) => {
    if (err) {
      throw err
    }
    res.render("accounts/index", { 
      name:results.name, nextpg: 
      progObj['nxtpg'],
      nxtLink: progLinks[progObj['nxtpg']]
     }); 
  });
});


router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("accounts/login", { headerText: "Log In" });
});

router.post("/login", checkNotAuthenticated, passport.authenticate('local', {
        failureRedirect: './login', 
        failureFlash:true,
      }), async (req, res) => {
        let ou = await checkProgress(req, res)
        console.log(progObj, progLinks[progObj['nxtpg']])
        res.render('accounts/', { 
          name:req.user.name, 
          nextpg:progObj['nxtpg'], 
          nxtLink: progLinks[progObj['nxtpg']]
         })
      })

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("accounts/register", { headerText: "Register" });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const trial = Math.round(Math.random())
    const checkDupUser = await User.findOne({ username: req.body.username }, async (err, results) => {
      if (err) {
        throw (err)
      }
      if (results) {
        res.render("accounts/register", {errMsg: 'This username already exists. Please try again.'})
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const insertUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
          trial: trial,
          day: 1
        })
        res.redirect("./login");
      }
    }).clone()
  } catch (e) {
    console.log('error', e)
    res.render("accounts/register", {errMsg: 'There was an error. Please try again.'});
  }
});

router.delete('/logout', (req, res) => {
    req.logOut((e) => {
        if (e) {
          return next(e)
        }
        res.redirect('/')
    })  
})

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('./login')

}

function checkNotAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      try {
        return res.redirect('./')
      } catch {
        return res.redirect('accounts/')
      }
    }
    return next()
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
          progObj['nxtpg'] = 'training'
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


module.exports = router;

