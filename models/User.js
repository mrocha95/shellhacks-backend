const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  age: {
    type: Number,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
