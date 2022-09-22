const express = require("express");
const router = express.Router();

const User = require("../models/account");

let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;

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

// get the dream log page
router.get("/dream-log", checkAuthenticated, (req, res) => {
  console.log('getting dream log')
  
  const _id = req.session.passport.user
  // also change to show that first night is slept. when done update model that dream log is done.
  User.findOne({ _id }, (err, results) => {
    if (err) {
      throw (err)
    } else {
      res.render("surveys/dream-log", { 
        headerText: "Dream Log", 
        participantID: _id,
        whichDay: results.day,
        whatTime: dateTime
       });
    }
  })
});

router.post("/dream-log", checkAuthenticated, async (req, res) => {
  console.log('posted to dream-log')
  const _id = req.session.passport.user
  try {
    const filter = { _id: _id };
    const updateDoc = {
      $set: {
        slept1: true
      },
    };
    const updd = await User.updateOne(filter, updateDoc, { upsert: true });
    User.findOne({ _id }, (err, results) => {
      if (err) {
        throw (err)
      } else {
        res.render("surveys/dream-log", { 
          headerText: "Dream Log", 
          participantID: _id,
          whichDay: results.day,
          whatTime: dateTime
         });
      }
    })
   } catch (e) {
    res.redirect("/index");
    throw(e)
  }
})

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

function checkSlept () {

}

module.exports = router;
