var express = require("express");
var router = express.Router();
const Goal = require("../models/Goal");
const { isAuthenticated } = require("../middleware/auth");
var request = require("request");
const axios = require("axios");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ message: "goals" });
});

router.get("/my-goals", isAuthenticated, async (req, res) => {
  try {
    const allGoals = await Goal.find({ creatorId: req.user.id });
    res.json(allGoals);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/create", isAuthenticated, async (req, res) => {
  console.log(req.body.title);
  try {
    let newGoal = await Goal.create({
      title: req.body.title,
      date: req.body.date,
      current: req.body.initial,
      amount: req.body.amount,
      creatorId: req.user.id,
    });

    res.json(newGoal);
  } catch (err) {
    res.json(err.message);
  }
});

router.delete("/delete-goal/:id", isAuthenticated, async (req, res) => {
  try {
    const removedGoal = await Goal.findByIdAndDelete(req.params.id);
    res.json(removedGoal);
  } catch (err) {
    res.json(err.message);
  }
});

router.post("/update-goal/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { ...req.user.id },
      { new: true }
    );
    res.json(updatedGoal);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
