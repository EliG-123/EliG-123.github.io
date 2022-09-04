const express = require("express");
const router = express.Router();

const User = require("../models/account");

// Begin Survey Page
router.get("/", checkAuthenticated, checkAnswered, (req, res) => {
  try {
    const _id = req.session.passport.user;
    User.findOne({ _id }, (err, results) => {
      if (err) {
        throw err;
      }
    });
    res.render("surveys/index");
  } catch {
    res.render("surveys/index");
  }
});

// Take survey page
router.get("/take", checkAuthenticated, checkAnswered, (req, res) => {

  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let dateTime = date+' '+time;
  
  const _id = req.session.passport.user
  User.findOne({ _id }, (err, results) => {
    if (err) {
      throw (err)
    } else {
      res.render("surveys/take", { 
        headerText: "Questionnaire", 
        participantID: _id,
        whichDay: results.day,
        whatTime: dateTime
       });
    }
  })
  
});

// submit the survey
router.post("/", checkAuthenticated, async (req, res) => {
  try {
    const filter = { _id: req.session.passport.user };
    const updateDoc = {
      $set: {
        q1a: true
      },
    };
    const result = await User.updateOne(filter, updateDoc, { upsert: true });
    res.redirect("/sleep");
  } catch {
    res.render("/surveys/", {
      errorMessage: "there was an error",
    });
  }
});

// ------------ PROGRESS/AUTH CHECKING FUNCTIONS ------------ //

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

function checkAnswered(req, res, next) {
  const _id = req.session.passport.user;
  User.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }
    if (!results.q1a) {
      return next();
    } else {
      return res.redirect("/sleep");
    }
  });
}

module.exports = router;
