const Web3 = require("web3");

// PRIVATE_KEY
const { PRIVATE_KEY, WS_PROVIDER } = require("../config");

const Provider = require("@truffle/hdwallet-provider");
const provider = new Provider(PRIVATE_KEY, WS_PROVIDER);

const Web3HTTP = new Web3(provider);

module.exports = Web3HTTP;
