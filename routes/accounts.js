if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express")
const app = express()
const router = express.Router();
const bcrypt = require("bcrypt");
const initializePassport = require("../passport-config")
const passport = require("passport")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

initializePassport(
    passport, 
    (username) => {return users.find((user) => user.username === username)},
    id => users.find(user => user.id === id)
)


router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

router.use(passport.session())

const users = [];

router.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(methodOverride('_method'))



router.get("/", checkAuthenticated, (req, res) => {
  res.render("accounts/index", { name: req.user.name});
});

router.get("/login",checkNotAuthenticated, (req, res) => {
  res.render("accounts/login", { headerText: "Log In" });
});

router.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: './',
    failureRedirect: './login',
    failureFlash: true
}))

router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("accounts/register", { headerText: "Register" });
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect("./login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

router.delete('/logout', (req, res) => {
    req.logOut((e) => {
        if (e) {return next(e)}
        res.redirect('/')
    })  
})

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('accounts/login')
}

function checkNotAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('accounts/')
    }
    return next()
}

module.exports = router;
