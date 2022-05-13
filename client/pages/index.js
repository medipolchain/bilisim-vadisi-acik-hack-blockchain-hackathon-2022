import React from "react";

// Components
import { ConnectButton } from "../components/ui";

// Hooks
import { useAccount } from "../components/hooks";
import { useWeb3 } from "../components/providers";

// Axios Client
import { axiosClient } from "utils/axiosClient";

export default function Home() {
  // Hooks Initialization
  const { account } = useAccount();
  const { connect, web3 } = useWeb3();

  return (
    <div className="container mx-auto flex p-10">
      {/* Main Card */}
      <div className="shadow-2xl border-sm mt-20 flex w-11/12 h-20 mx-20 bg-green-500 justify-around">
        <p className="text-2xl font-bold text-right montserrat my-auto">
          Welcome to the Supply Chain System
        </p>
        <ConnectButton
          account={account}
          connect={connect}
          web3={web3}
          style={{ marginTop: "auto", marginBottom: "auto" }}
        />
      </div>
    </div>
  );
}
