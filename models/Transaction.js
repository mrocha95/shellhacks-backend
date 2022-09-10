const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
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

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
