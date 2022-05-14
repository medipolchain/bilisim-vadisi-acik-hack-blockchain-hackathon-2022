const Web3 = require("web3");

const { provider } = require("./provider");

const Web3HTTP = new Web3(provider);

module.exports = { Web3HTTP };
