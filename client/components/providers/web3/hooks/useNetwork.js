import React from "react";
import useSWR from "swr";

// const targetNetwork = 43114; // Mainnet
const targetNetwork = 43113; // FUJI Testnet
// const targetNetwork = 1337; // Ganache

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = await web3.eth.getChainId();

      if (!chainId) {
        throw new Error("Cannot retrieve network. Please refresh the browser.");
      }

      return chainId;
    }
  );

  React.useEffect(() => {
    provider &&
      provider.on("chainChanged", (chainId) => {
        mutate(parseInt(chainId, 16));
      });
  }, [mutate]);

  return {
    data,
    mutate,
    target: targetNetwork,
    isSupported: data === targetNetwork,
    ...rest,
  };
};
