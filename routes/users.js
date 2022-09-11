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
  console.log(req.body);
  if (!req.body.email || !req.body.password) {
    return res.json({ message: "Please enter email and password" });
  }
  try {
    const salt = bcrypt.genSaltSync(saltrounds);
    const hashedpass = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({
      email: req.body.email,
      password: hashedpass,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      phone: req.body.phone,
    });

    const payload = {
      email: newUser.email,
      id: newUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.json({
      token: token,
      email: newUser.email,
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.json({ message: "Incorrect email and password" });
  }
  try {
    let foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      return res.json({ message: "incorrect email or password" });
    }
    const payload = {
      email: foundUser.email,
      id: foundUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });
    res.json({
      token: token,
      email: foundUser.email,
      firstName: foundUser.firstName,
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
