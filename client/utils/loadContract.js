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
      "0x681742F2CBC82435374Dd7F58b6143BA9C389aF8"
    );

    console.log(`Contract ${name} loaded`);
  } catch (e) {
    console.log(`Contract ${name} can not loaded from client side`);
    console.log(e);
  }

  return contract;
};
