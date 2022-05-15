const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  admin: {
    type: String,
    required: true,
    trim: true,
  },
  currentCarrier: {
    type: String,
    required: true,
    trim: true,
  },
  expirationDate: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  allCarriers: {
    type: Array,
    required: false,
  },
  problem: {
    type: Array,
    required: false,
  },
  packageID: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  isFinished: {
    type: Boolean,
    required: false,
    default: false,
  },
  problem: {
    type: Array,
    required: false,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
