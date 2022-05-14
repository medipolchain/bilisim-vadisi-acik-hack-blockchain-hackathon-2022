export const loadContract = async (name, web3) => {
  let contract = null,
    Artifacts = null;

  let networkID = 43113; // Fuji Testnet

  try {
    let res = await fetch(`/contracts/${name}.json`);
    Artifacts = await res.json();

    contract = new web3.eth.Contract(
      Artifacts,
      // Artifacts.networks[networkID].address
      "0x690d2CaFF4560e19524EF81077b21D21c4AaBC87"
    );

    console.log(`Contract ${name} loaded`);
  } catch (e) {
    console.log(`Contract ${name} can not loaded from client side`);
    console.log(e);
  }

  return contract;
};
