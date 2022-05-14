const router = require("express").Router();

// Auth middleware
const { auth } = require("../middleware/auth");

// Product model
const Product = require("../models/product");

// Sha256 hash
const sha256 = require("js-sha256");

const { contract } = require("../web3/http");

// POST /api/product
router.post("/create", async (req, res) => {
  try {
    const product = new Product({
      admin: req.user.publicAddress,
      currentCarrier: req.body.currentCarrier,
      expirationDate: req.body.expirationDate,
      name: req.body.name,
    });

    var hash = sha256(
      `${product.admin} ${product.currentCarrier} ${product.expirationDate} ${product.name}`
    );

    product.packageID = hash;

    await contract.methods
      .createDeliveryPackage("0x" + hash.toString(), product.currentCarrier)
      .send({
        from: "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
      });
    await product.save();

    res.status(201).json({
      message: "Product created",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
