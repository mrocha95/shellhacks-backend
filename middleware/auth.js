const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token === "null") {
    console.log("NO TOKEN");
    return res.status(400).json({ message: "Token not found" });
  }
  try {
    console.log(process.env);
    const tokenInfo = jwt.verify(token, process.env.SECRET);
    console.log(tokenInfo);
    req.user = tokenInfo;
    next();
  } catch (error) {
    return res.status(440).json(error);
  }
};

module.exports = {
  isAuthenticated,
};
