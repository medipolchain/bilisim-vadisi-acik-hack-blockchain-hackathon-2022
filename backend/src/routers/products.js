const router = require("express").Router();

// Auth middleware
const { auth } = require("../middleware/auth");

// Product model
const Product = require("../models/product");

// Sha256 hash
const sha256 = require("js-sha256");

const abi = require("../contract/ABIs/abi.json");

const Web3HTTP = require("../web3/web3http");

const contract = new Web3HTTP.eth.Contract(
  abi,
  "0x681742F2CBC82435374Dd7F58b6143BA9C389aF8"
);

// GET /api/products/all?publicAddress=?
router.get("/all", auth, async (req, res) => {
  let publicAddress = req.query.publicAddress;

  // Get all products
  let products = await Product.find({
    admin: publicAddress.toLowerCase(),
  });

  // Return products
  res.json(products);
});

// POST /api/product
router.post("/create", auth, async (req, res) => {
  try {
    const product = new Product({
      admin: req.user.publicAddress,
      currentCarrier: req.body.currentCarrier,
      expirationDate: req.body.expirationDate,
      name: req.body.name,
    });

    var hash = sha256(
      `${product.admin} ${product.currentCarrier} ${product.expirationDate} ${product.name} ${product._id}`
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

// GET /product?hash=
router.get("/:packageID", auth, (req, res) => {
  try {
    const packageID = req.params.packageID;
    console.log(packageID);

    Product.findOne({ packageID }).then((product) => {
      if (!product) {
        return res.status(404).send("Product not found");
      }
      res.send(product);
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(err);
  }
});

module.exports = router;

/**
 *,{
    "_id": "627fe2c92565e0df1ceb544e",
    "admin": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
    "currentCarrier": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
    "expirationDate": 100,
    "name": "name",
    "allCarriers": [],
    "problem": [
        {
            "carrier": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
            "timestamp": "1652548863"
        },
        {
            "carrier": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
            "timestamp": "1652549855"
        },
        {
            "carrier": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
            "timestamp": "1652549873"
        },
        {
            "carrier": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
            "timestamp": "1652550114"
        },
        {
            "carrier": "0x0792D268DD590B6d6dB00940E98fc7827deD8346",
            "timestamp": "1652550272"
        }
    ],
    "packageID": "4c699181526c2bc4aa0ef5aa3f51062dbc5a3dcd4368e060112581f84410b7e0",
    "isFinished": false,
    "__v": 5
}
 */
