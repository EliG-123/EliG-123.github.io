const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    joined: {type: Date, default: Date.now()},
    name: String,
    email: String,
    username: String, 
    password: String,
    day: Number, //what day of experiment
    trial: Number, //control or experimental
    q1a: String, //answers to the first survey/questionaiire questions
    q2a: String,
    q3a: String,
    q4a: String,
    vol1: Number, // volumes from soundcheck, only one is important, not sure which
    vol2: Number
})



module.exports = mongoose.model("User", userSchema)