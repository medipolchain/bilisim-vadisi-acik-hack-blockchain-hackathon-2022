const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  publicAddress: {
    type: String,
    required: true,
    unique: true,
  },
  nonce: {
    type: Number,
    default: parseInt(Math.random() * 1000),
  },
  email: {
    type: String,
    required: false,
    default: "",
  },
  notification: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
