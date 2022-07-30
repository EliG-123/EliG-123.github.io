const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  response: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Answer", answerSchema);
