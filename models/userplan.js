var mongoose = require("mongoose");
var UserplanSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  plan: {
    type: Array,
    required: true,
    trim: true
  }
});

var Userplan = mongoose.model("userplan", UserplanSchema);
module.exports = Userplan;