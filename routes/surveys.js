const express = require('express');
const router = express.Router();

const User = require('../models/account');


// Begin Survey Page
router.get('/', checkAuthenticated, (req, res) => {
    const _id = req.session.passport.user
    User.findOne({ _id }, (err, results) => {
        if (err) {
          throw err
        }
        console.log(results.name, results.q2a); 
      });
    res.render('surveys/index')
})

// Take survey page
router.get('/take', checkAuthenticated, (req, res) => {
    res.render('surveys/take', { headerText: "Questionnaire", answer : new Answer() })
})

router.post('/', checkAuthenticated, async (req, res) => {
    try {
        const filter = {
            
        }
        const updateDoc = {
            $set: {
                q1a: req.body.q1,
                q2a: req.body.q2,
                q3a: req.body.q3,
                q4a: req.body.q4,
            }
        }
        const result = await User.updateOne(filter, updateDoc)
        console.log(result)
    } catch {
        res.render('/surveys/', {
            answer: answer,
            errorMessage: "there was an error"
        })
    }
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

function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/')

}



module.exports = router 