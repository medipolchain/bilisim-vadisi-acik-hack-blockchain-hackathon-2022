import React from "react";

// Hooks
import { useAccount, useNetwork } from "../components/hooks";
import { useWeb3 } from "../components/providers";

// Components
import { RestrictedArea, AdminContent } from "../components/ui";

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
    <div className="container">
      {!network?.isSupported ? (
        <p>Change network</p>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center mt-96">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {!isAdmin ? (
                <AdminContent account={account?.data} web3={web3} />
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
