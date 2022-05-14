const Web3 = require("web3");

const { provider } = require("./provider");
const abi = require("../contract/ABIs/abi.json");

const Web3HTTP = new Web3(provider);

const contract = new Web3HTTP.eth.Contract(
  abi,
  "0x4690c783B49526396b124eEaA95334846A5A7b1F"
);

module.exports = { Web3HTTP, contract };
