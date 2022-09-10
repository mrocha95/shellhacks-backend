var express = require("express");
var router = express.Router();
const Transaction = require("../models/Transaction");
const { isAuthenticated } = require("../middleware/auth");
var request = require("request");

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
  try {
    // var options = {
    //   method: "POST",
    //   url: "https://sh-categorize.herokuapp.com/category",
    //   headers: {
    //     Accept: "application/json",
    //   },
    //   formData: {
    //     expense: req.body.title,
    //   },
    // };
    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
    //   console.log(response.body);
    // });

    // const response = await axios.request(options);

    // res.json(response.data);

    let newTransaction = await Transaction.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      amount: req.body.amount,
      type: req.body.type,
      //   category: response.f,
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
