// jwt
const jwt = require("jsonwebtoken");

// JWT Secret
const { JWT_SECRET } = require("../config/index");

const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;
    console.log(user);

    next();
  });
};

module.exports = { auth };
