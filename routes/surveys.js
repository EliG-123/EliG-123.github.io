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
      console.log(results.name, results.q2a);
    });
    res.render("surveys/index");
  } catch {
    res.render("surveys/index");
  }
});

// Take survey page
router.get("/take", checkAuthenticated, checkAnswered, (req, res) => {
  res.render("surveys/take", { headerText: "Questionnaire" });
});

router.post("/", checkAuthenticated, checkAnswered, async (req, res) => {
  try {
    const filter = { _id: req.session.passport.user };
    const updateDoc = {
      $set: {
        q1a: req.body.q1,
        q2a: req.body.q2,
        q3a: req.body.q3,
        q4a: req.body.q4,
      },
    };
    const result = await User.updateOne(filter, updateDoc, { upsert: true });
    console.log(result);

    res.redirect("/sleep");
  } catch {
    res.render("/surveys/", {
      errorMessage: "there was an error",
    });
  }
});

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
