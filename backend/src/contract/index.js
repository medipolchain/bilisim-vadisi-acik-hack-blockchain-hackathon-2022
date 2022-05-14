const { Web3WS } = require("../web3/ws");

// Mongoose Models
const Product = require("../models/product");

const abi = require("./ABIs/abi.json");

// Contract Instance
const contract = new Web3WS.eth.Contract(
  abi,
  "0x4690c783B49526396b124eEaA95334846A5A7b1F"
);

// New Package Created Events
contract.events
  .NewPackageCreated({}, function (error, event) {
    if (error) {
      console.error(error.message);
      console.error("Error!! on NewPackageCreated event listener.");
    }
  })
  .on("data", async function (data) {
    let returnValues = data.returnValues;
    // log
  });

// Package Arrived Created Events
contract.events
  .PackageArrived({}, function (error, event) {
    if (error) {
      console.error(error.message);
      console.error("Error!! on NewPackageCreated event listener.");
    }
  })
  .on("data", function (data) {
    let returnValues = data.returnValues;
    let id = returnValues._packageId;

    Product.findOne({ packageID: id }, async (err, product) => {
      if (err) console.error(err);
      else {
        product.isFinished = true;
        product.currentCarrier = product.admin;
        await product.save();
      }
    });
  });

// PackageCarrierChange Events
contract.events
  .PackageCarrierChange({}, function (error, event) {
    if (error) {
      console.error(error.message);
      console.error("Error!! on NewPackageCreated event listener.");
    }
  })
  .on("data", async function (data) {
    let returnValues = data.returnValues;
    let id = returnValues._packageId;

    Product.findOne({ packageID: id }, async (err, product) => {
      if (err) console.error(err);
      else {
        product.currentCarrier = returnValues._to;
        product.allCarriers = [
          ...product.allCarriers,
          {
            address: returnValues._sender,
            timestamp: _timestamp,
          },
        ];
        await product.save();
      }
    });
  });

// TemperatureViolated Events
contract.events
  .TemperatureViolated({}, function (error, event) {
    if (error) {
      console.error(error.message);
      console.error("Error!! on NewPackageCreated event listener.");
    }
  })
  .on("data", async function (data) {
    let returnValues = data.returnValues;

    let id = returnValues._packageId;

    Product.findOne({ packageID: id }, async (err, product) => {
      if (err) console.error(err);
      else {
        product.problem = [
          ...product.problem,
          {
            carrier: returnValues._currentCarrier,
            timestamp: returnValues.timestamp,
          },
        ];
        await product.save();
      }
    });
  });

module.exports = { contract };
