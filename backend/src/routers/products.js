const router = require("express").Router();

// Auth middleware
const auth = require("../middleware/auth");

// Product model
const Product = require("../models/product");

const sha256 = require("js-sha256");

const { Web3HTTP } = require("../web3/http");

// POST /api/product
router.post("/", auth, async (req, res) => {
  try {
    const product = new Product({
      admin: req.user.publicAddress,
      currentCarrier: req.body.currentCarrier,
      expirationDate: req.body.expirationDate,
      name: req.body.name,
      allCarriers: req.body.allCarriers,
    });
    await product.save();

    var hash = sha256(
      `${product.admin} ${product.currentCarrier} ${product.expirationDate} ${product.name}`
    );

    console.log("Hash ", hash);
  } catch (error) {
    res.status(400).send(error);
  }
});
