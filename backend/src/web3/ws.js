const Web3 = require("web3");

const { WS_PROVIDER } = require("../config");

const Web3WS = new Web3(WS_PROVIDER);

module.exports = { Web3WS };
