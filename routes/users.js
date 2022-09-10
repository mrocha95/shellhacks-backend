var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");
const { token } = require("morgan");
const saltrounds = 10;

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ message: "users" });
});

router.post("/signup", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Please enter username and password" });
  }
  try {
    const salt = bcrypt.genSaltSync(saltrounds);
    const hashedpass = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({
      username: req.body.username,
      password: hashedpass,
    });

    const payload = {
      username: newUser.username,
      id: newUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.json({
      token: token,
      username: newUser.username,
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.json({ message: "Incorrect username and password" });
  }
  try {
    let foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      return res.json({ message: "incorrect username or password" });
    }
    const payload = {
      username: foundUser.username,
      id: foundUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.json({
      token: token,
      username: foundUser.username,
    });
  } catch (err) {
    res.json(err.message);
  }
});

router.get("/user-profile/:id", isAuthenticated, async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    res.json(foundUser);
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
