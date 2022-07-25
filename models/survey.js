const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
    question1: {
        type: String,
        required: true
    },
    question2: {
        type: String,
        required: true
    },
    question3: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Survey', surveySchema)