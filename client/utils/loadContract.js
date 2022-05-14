export const loadContract = async (name, web3) => {
  let contract = null,
    Artifacts = null;

  let networkID = 43113; // Fuji Testnet

  try {
    res = await fetch(`/contracts/${name}.json`);
    Artifacts = await res.json();

    contract = new web3.eth.Contract(
      Artifacts.abi,
      Artifacts.networks[networkID].address
    );

    console.log(`Contract ${name} loaded`);
  } catch (e) {
    console.log(`Contract ${name} can not loaded from client side`);
  }

  return contract;
};
