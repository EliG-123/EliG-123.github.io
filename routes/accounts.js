if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express")
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport")
const localStrategy = require('passport-local').Strategy


const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require("../passport-config")
const User = require('../models/account');


initializePassport(
    passport, 
    id => User.findOne({id: id})
)


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



router.get("/", checkAuthenticated, (req, res) => {
  const _id = req.session.passport.user
  User.findOne({ _id }, (err, results) => {
    if (err) {
      throw err
    }
    res.render("accounts/index", { name:results.name }); 
  });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("accounts/login", { headerText: "Log In" });
});


router.post("/login", checkNotAuthenticated, passport.authenticate('local', {
        failureRedirect: './login', 
        failureFlash:true,
      }), (req, res) => {
        res.render('accounts/', { name:req.user.name })
      })


router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("accounts/register", { headerText: "Register" });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const trial = Math.round(Math.random())
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
  } catch {
    console.log('error')
    res.redirect("./register");
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

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) {
//     return res.sendStatus(401)
//     }
//   req.token = token
//   next()
// }

module.exports = router;
