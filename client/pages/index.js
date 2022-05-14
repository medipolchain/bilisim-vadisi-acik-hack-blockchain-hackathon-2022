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
  const { connect, web3, contract } = useWeb3();

  // States
  const [information, setInformation] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const getInformation = async () => {
      const c = await web3.eth.getCoinbase();
      const response = await axiosClient.get(`/user/${c}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setInformation(response.data.user);
    };

    const handleSignMessage = async ({ publicAddress, nonce }) => {
      let sig = await web3.eth.personal.sign(
        web3.utils.fromUtf8(
          `Supply Chain Authentication for ${publicAddress} with none : ${nonce}`
        ),
        publicAddress,
        "",
        (err, signature) => {
          if (err) {
            console.log(err);
            return;
          }
          return signature;
        }
      );

      axiosClient
        .post(`/user/${publicAddress}/signature`, {
          signature: sig,
        })
        .then((response) => {
          localStorage.setItem("access_token", response.data.token);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const handleSignUp = async (address) => {
      await axiosClient
        .post("/user", {
          publicAddress: address,
        })
        .then((res) => {
          let publicAddress = res.data.user.publicAddress;
          let nonce = res.data.user.nonce;

          handleSignMessage({ publicAddress, nonce });
        });
    };

    const handleLogIn = async () => {
      const c = await web3.eth.getCoinbase();
      console.log(c);

      await axiosClient
        .get(`/user/${c}`)
        .then((resp) => {
          let publicAddress = resp.data.user.publicAddress;
          let nonce = resp.data.user.nonce;

          let jwt = localStorage.getItem("access_token");

          if (!jwt) {
            handleSignMessage({ publicAddress, nonce });
          } else {
            getInformation();
          }
        })
        .catch((err) => {
          let errorMessage = err.response.data.message;
          console.log(errorMessage);
          if (errorMessage === "User not found") {
            handleSignUp(c);
          }
        });
    };

    if (account?.data && web3) handleLogIn();
  }, [account?.data, web3]);

  React.useEffect(() => {
    const fetchData = async () => {
      const c = await contract.methods.admins(account?.data).call();
      setIsAdmin(c);
    };

    if (account?.data && web3 && contract) fetchData();
  }, [account?.data, web3, contract]);
  return (
    <>
      <div className="container mx-auto flex m-10 flex-col">
        {/* Main Card */}
        <div className="shadow-2xl border-sm mt-20 flex w-full h-20 rounded-lg justify-around">
          <p className="text-2xl font-bold text-right montserrat my-auto">
            Welcome to the Supply Chain System
          </p>
          <ConnectButton
            account={account}
            connect={connect}
            web3={web3}
            style={{ marginTop: "auto", marginBottom: "auto" }}
            information={information}
          />
        </div>
        {!isAdmin ? (
          <div className="w-60 flex justify-center bg-blue-800 text-white rounded-md">
            <span className="montserrat tracking-wider text-2xl my-8">
              Create Product
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
}
