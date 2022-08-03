const express = require('express')
const router = express.Router();
const passport = require("passport")
const methodOverride = require('method-override')
const session = require('express-session')




router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'))

router.get('/', (req, res) => {
    res.render('index.ejs')
})

router.post('/logout', function(req, res){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

module.exports = router 