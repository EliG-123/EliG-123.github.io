const express = require('express');
const router = express.Router();
const Answer = require('../models/survey')


// Begin Survey Page
router.get('/', (req, res) => {
    res.render('surveys/index')
})

// Take survey page
router.get('/take', (req, res) => {
    res.render('surveys/take', { headerText: "Take Survey", answer : new Answer() })
})

// // "Create author route?""
// router.post('/', async (req, res) => {
//     const answer = new Answer({
//         answer: req.body.response1
//     })
//     try {
//         const newAnswer = await answer.save()
//         res.redirect('/sleep')
//     } catch {
//         res.render('/surveys/', {
//             answer: answer,
//             errorMessage: "ther was an error"
//         })
//     }
// })


module.exports = router 