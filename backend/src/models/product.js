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
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  allCarriers: [
    {
      address: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Products = mongoose.model("Products", productSchema);

module.export = Products;
