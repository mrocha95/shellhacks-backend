var express = require("express");
var router = express.Router();
const Transaction = require("../models/Transaction");
const { isAuthenticated } = require("../middleware/auth");
const { getCategory } = require("../categorize");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ message: "transactions" });
});

router.get("/my-transactions", isAuthenticated, async (req, res) => {
  try {
    const allTransactions = await Transaction.find({ creatorId: req.user.id });
    res.json(allTransactions);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  const title = req.body.title;
  const category = await getCategory(title);
  try {
    let newTransaction = await Transaction.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      amount: req.body.amount,
      type: req.body.type,
      category : category.data.category,
      creatorId: req.user.id,
    });

    res.json(newTransaction);
  } catch (err) {
    res.json(err.message);
  }
});

router.delete("/delete-transaction/:id", isAuthenticated, async (req, res) => {
  try {
    const removedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    res.json(removedTransaction);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/update-transaction/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.json(updatedTransaction);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
