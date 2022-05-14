// Mongoose Model
const User = require("../models/users");

// Express.js Router
const router = require("express").Router();

// ethereum-js utils for Signature authentication
const { bufferToHex } = require("ethereumjs-util");
const { recoverPersonalSignature } = require("eth-sig-util");

// JWT
const jwt = require("jsonwebtoken");

// JWT Secret
const { JWT_SECRET } = require("../config/index");

// web3
const Web3 = require("web3");
const { auth } = require("../middleware/auth");

// POST /api/settings
router.post("/settings", auth, async (req, res) => {
  let isChecked, input;

  try {
    isChecked = req.body.isChecked;
    input = req.body.input;
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Bad Request",
      error: "Internal server error",
    });
  }

  const us = await User.findOne({ publicAddress: req.user.publicAddress });

  if (!us) {
    res.status(404).json({
      message: "User not found",
      error: "Internal server error",
    });
  }

  us.notification = isChecked;
  us.email = input.trim();

  await us.save();

  res.status(200).json({
    message: "User settings updated",
    user: us,
  });
});

// GET /api/user/:publicAddress/info
router.get("/user/:publicAddress", async (req, res) => {
  let publicAddress = req.user.publicAddress;
  console.log(publicAddress);
  User.findOne({ publicAddress }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }

    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: "Internal server error",
      });
    }

    res.status(200).json({
      message: "User found",
      user,
    });
  });
});

// POST /api/user
router.post("/", async (req, res) => {
  let publicAddress;

  try {
    publicAddress = req.body.publicAddress;
  } catch (e) {
    return res.status(400).send({
      message: "Internal Server Error",
      error: "publicAddress is required",
    });
  }

  const isValid = Web3.utils.isAddress(publicAddress);

  if (!isValid) {
    return res.status(400).send({
      message: "Internal Server Error",
      error: "publicAddress is not valid Ethereum address",
    });
  }

  const user = new User({ publicAddress });

  await user.save((err, user) => {
    if (err) {
      res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    } else {
      res.status(201).json({
        message: "User created",
        user,
      });
    }
  });
});

// GET /api/user/:publicAddress
router.get("/:publicAddress", async (req, res) => {
  const publicAddress = req.params.publicAddress;

  const user = await User.findOne({ publicAddress });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      error: "Internal server error",
    });
  }

  res.status(200).json({
    message: "User found",
    user,
  });
});

// POST /api/user/:publicAddress/signature
router.post("/:publicAddress/signature", (req, res) => {
  const { publicAddress } = req.params;

  try {
    let { signature } = req.body;

    User.findOne({ publicAddress }, async (err, user) => {
      if (err) {
        res.status(500).json({
          message: "Internal Server Error",
          error: err,
        });
      }

      if (!user) {
        res.status(404).json({
          message: "User not found",
          error: "Internal server error",
        });
      }

      const msg = `Supply Chain Authentication for ${publicAddress} with none : ${user.nonce}`;
      const hex = bufferToHex(Buffer.from(msg));

      const expectedAddress = recoverPersonalSignature({
        data: hex,
        sig: signature,
      });

      if (
        expectedAddress.toLocaleLowerCase() ===
        publicAddress.toLocaleLowerCase()
      ) {
        // Create new user nonce and save it to database
        user.nonce = parseInt(Math.random() * 1000);
        await user.save();

        // Create JWT
        const token = jwt.sign({ publicAddress }, JWT_SECRET, {
          expiresIn: "1w",
        });

        res.status(200).json({
          message: "User authenticated",
          token,
          user,
        });
      } else {
        res.status(401).json({
          message: "User not authenticated",
          error: "Internal server error",
        });
      }
    });
  } catch (e) {
    return res.status(400).send({
      message: "Internal Server Error",
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
