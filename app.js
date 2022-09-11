var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv/config");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var transactionsRouter = require("./routes/transactions");
var smsRouter = require("./routes/sms");
var goalsRouter = require("./routes/goals");


var app = express();

app.listen(3000, () => {
  console.log("Exppress server listening on port 3000");
});


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/transactions", transactionsRouter);
app.use("/goals", goalsRouter);
app.use("/sms", smsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();

  const message = twiml.message();
  message.body("The Robots are coming! Head for the hills!");
  message.media(
    "https://farm8.staticflickr.com/7090/6941316406_80b4d6d50e_z_d.jpg"
  );

  res.type("text/xml").send(twiml.toString());
});

module.exports = app;
