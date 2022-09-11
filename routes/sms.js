var express = require("express");
var router = express.Router();
const Transaction = require("../models/Transaction");
require("dotenv/config");
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const twilio = require("twilio");
const { getCategory } = require("../categorize");

const twilio_client = new twilio(accountSid, authToken);

/* GET sms listing. */
router.get("/", function (req, res, next) {
  res.json({ message: "sms" });
});

router.post("/send", async (req, res) => {
  // query = req.body.title;
  // console.log(query);
  // var options = {
  //   method: "GET",
  //   url: `https://api.funtranslations.com/translate/emoji?text=${query}`,
  //   headers: {},
  //   form: {},
  // };
  // let relevantString;
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   console.log(response);
  //   if (response.body.contents.translated) {
  //     console.log("response: ", response.body.contents.translated);
  //     relevantString =
  //       "0" +
  //       response.body.contents.translated.substring(
  //         stringResponse.length - 7,
  //         stringResponse.length - 1
  //       );
  //   }
  //   } else {
  relevantString = "0x1F4B0";
  //   }
  //});
  console.log(relevantString);
  const encodedEmoji = String.fromCodePoint(relevantString);
  console.log(encodedEmoji);

  try {
    twilio_client.messages
      .create({
        body: `Hello from SaveExp ${encodedEmoji}! Reply with title, amount, type to add a transaction`,
        to: "+17866748198", // Text this number
        from: "+12058801498", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  } catch (err) {
    res.json(err.message);
    return;
  }
  res.json(200);
});

router.post("/receive", async (req, res) => {
  try {
    sender = req.body.From;
    const filter = { phone: sender };
    const user = await Transaction.findOne(filter);
    console.log("user: ", user);
    const userId = "631d5c36fcd2ac57734a8bfe";
    console.log("userId: ", userId);
    console.log(`Incoming message from ${req.body.From}: ${req.body.Body}`);
    const incomingMessageText = req.body.Body;
    console.log("incoming: ", incomingMessageText);
    [title, amount, type] = incomingMessageText.split(" ");
    const category = await getCategory(title);
    mongores = await Transaction.create({
      title,
      date: "exmaple-date",
      amount,
      type,
      category: category.data.category,
      creatorId: userId,
    });
    console.log(mongores);
  } catch (err) {
    res.json(err.message);
    return;
  }
  res.json(200);
});

module.exports = router;
