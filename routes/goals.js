var express = require("express");
var router = express.Router();
const Goal = require("../models/Goal");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");

require("dotenv/config");
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const twilio = require("twilio");
const twilio_client = new twilio(accountSid, authToken);

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
      current: 0,
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
      { ...req.body },
      { new: true }
    );
    if (updatedGoal.current / updatedGoal.amount >= 0.5) {
      const goalOwner = await User.findById(updatedGoal.creatorId, "phone");
      console.log(goalOwner);
      try {
        twilio_client.messages
          .create({
            body: `You saved more than 50% to your goal ${
              updatedGoal.title
            }! ${String.fromCodePoint(
              "0x1F973"
            )} Keep going and you will soon be done! ${String.fromCodePoint(
              "0x1F4AA"
            )}`,
            to: goalOwner.phone, // Text this number
            from: "+12058801498", // From a valid Twilio number
          })
          .then((message) => console.log(message.sid));
      } catch (err) {
        console.log(err);
      }
    }
    res.json(updatedGoal);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
