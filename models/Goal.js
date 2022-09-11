const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  current: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
