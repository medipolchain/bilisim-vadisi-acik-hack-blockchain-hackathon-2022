const { Web3HTTP } = require("./http");

// PRIVATE_KEY
const { PRIVATE_KEY, HTTP_PROVIDER } = require("../config");

const Provider = require("@truffle/hdwallet-provider");
const provider = new Provider(PRIVATE_KEY, HTTP_PROVIDER);

module.exports = { provider };
