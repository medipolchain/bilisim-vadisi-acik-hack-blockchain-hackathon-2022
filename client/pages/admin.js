import React from "react";

// Hooks
import { useAccount, useNetwork } from "../components/hooks";
import { useWeb3 } from "../components/providers";

// Components
import { RestrictedArea, AdminContent } from "../components/ui";

import styles from "../styles/Home.module.css";

const Admin = () => {
  const { account } = useAccount();
  const { web3, contract, connect } = useWeb3();
  const { network } = useNetwork();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let c = await contract.methods.admins(account?.data).call();
      setIsAdmin(c && localStorage.getItem("access_token"));
      setIsLoading(false);
    };

    if (contract && web3 && account?.data) fetchData();
  }, [contract, web3, account?.data, network?.isSupported]);

  return (
    <div className={`${styles.body_div} h-screen flex`}>
      {!network?.isSupported ? (
        <p>Change network</p>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center mt-96 flex m-auto">
              <div
                className="spinner-border text-light m-auto text-3xl"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {isAdmin ? (
                <AdminContent
                  account={account?.data}
                  web3={web3}
                  contract={contract}
                />
              ) : (
                <RestrictedArea />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
