const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    joined: {type: Date, default: Date.now()},
    name: String,
    email: String,
    username: String, 
    password: String,
    day: Number, // which day of experiment
    trial: Number, // control or experimental
    q1a: Boolean, // see if survey1 was completed
    vol1: Number, // volumes from soundcheck, only one is important, not sure which
    vol2: Number,
    slept1: Boolean, // see if nth night was completed
    slept2: Boolean,
    slept3: Boolean,
    dreamLog1a: Boolean, // see if nth dream log was completed
    dreamLog2a: Boolean,
    dreamLog3a: Boolean,
})



module.exports = mongoose.model("User", userSchema)