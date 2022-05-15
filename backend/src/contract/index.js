const Web3WS = require("../web3/ws");

// Mongoose Models
const Product = require("../models/product");

const abi = require("./ABIs/abi.json");

// Contract Instance
const contract = new Web3WS.eth.Contract(
  abi,
  "0x681742F2CBC82435374Dd7F58b6143BA9C389aF8"
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
    var mailOptions = {
      from: "beratreis54@gmail.com",
      to: "mberkayermis@gmail.com",
      subject: "Sending Email using Node.js",
      text: "That was easy!",
    };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Email sent: " + info.response);
    //   }
    // });
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
  .on("data", function (data) {
    console.log(data);
    let returnValues = data.returnValues;
    let id = returnValues._packageId;

    Product.findOne({ packageID: id.slice(2) }, async (err, product) => {
      if (err) console.error(err);
      else {
        console.log(product);
        if (product) {
          console.log(returnValues._to);
          product.currentCarrier = returnValues._to;
          product.allCarriers = [
            ...product.allCarriers,
            {
              address: returnValues._sender,
              timestamp: returnValues._timestamp,
            },
          ];
          await product.save();
        }
      }
    });
  });

contract.events
  .SetPackageDeliveryDoneOrUndone({}, function (error, event) {
    if (error) {
      console.error(error.message);
      console.error("Error!! on NewPackageCreated event listener.");
    }
  })
  .on("data", function (data) {
    console.log(data);
    let returnValues = data.returnValues;
    let id = returnValues._packageId;

    Product.findOne({ packageID: id.slice(2) }, async (err, product) => {
      if (err) console.error(err);
      else {
        console.log(product);
        if (product) {
          product.isFinished = returnValues._newDeliveryStatus;
          await product.save();
        }
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

    console.log(returnValues);
    let id = returnValues._packageId;

    id = id.substring(2);
    console.log(id);

    const p = await Product.findOne({ packageID: id });

    if (!p) {
      console.log("Product not found");
      return;
    }

    p.problem.push({
      carrier: returnValues._currentCarrier,
      timestamp: returnValues._timestamp,
    });

    try {
      await p.save();
    } catch (e) {
      console.log(e);
    }
  });

module.exports = { contract };

/**
 * , async (err, product) => {
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
 */
