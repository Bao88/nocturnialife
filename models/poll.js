var mongoose = require("mongoose");
var PollSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  poll: {
    type: Array,
    required: true,
    trim: true
  },
  votes: {
    type: Array,
    required: true,
    trim: true
  },
  voted: {
    type: Array,
    required: true,
    trim: true
  }
});

var Poll = mongoose.model("Poll", PollSchema);
module.exports = Poll;