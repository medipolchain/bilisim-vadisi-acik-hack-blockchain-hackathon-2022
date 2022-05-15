const Web3 = require("web3");

const { WS_PROVIDER } = require("../config");

const provider = new Web3.providers.WebsocketProvider(WS_PROVIDER);

provider.on("error", (error) => {
  console.log(error);
});
provider.on("connect", () => console.log("WS connected"));

const Web3WS = new Web3(provider);

provider.on("end", (e) => {
  console.log("WS closed");
  console.log("Attempting to reconnect...");
  provider = new Web3.providers.WebsocketProvider(RINKEBY_WSS);

  provider.on("connect", function () {
    console.log("WSS Reconnected");
  });

  Web3WS.setProvider(provider);
});

module.exports = Web3WS;
