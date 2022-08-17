const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    joined: {type: Date, default: Date.now()},
    name: String,
    email: String,
    username: String, 
    password: String,
    day: Number,
    trial: Number,
    q1a: String, 
    q2a: String,
    q3a: String,
    q4a: String,
    vol1: Number,
    vol2: Number
})



module.exports = mongoose.model("User", userSchema)