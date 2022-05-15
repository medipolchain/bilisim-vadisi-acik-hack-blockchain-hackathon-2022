import React from "react";

// Components
import { ConnectButton } from "../components/ui";

// Hooks
import { useAccount } from "../components/hooks";
import { useWeb3 } from "../components/providers";

// Axios Client
import { axiosClient } from "utils/axiosClient";

// CSS
import styles from "../styles/Home.module.css";

// Image
import content from "../images/cold.png";

import Link from "next/link";

export default function Home() {
  // Hooks Initialization
  const { account } = useAccount();
  const { connect, web3, contract } = useWeb3();

  // States
  const [information, setInformation] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [hash, setHash] = React.useState("");
  const [data, setData] = React.useState(null);

  const addListener = () => {
    contract?.events
      .TemperatureViolated({}, function (error, event) {
        if (error) {
          console.error(error.message);
          console.error("Error!! on NewPackageCreated event listener.");
        }
      })
      .on("data", (data) => {
        alert(
          "There is a problem with package " + data.returnValues._packageId
        );
        console.log(data.returnValues);
      });
  };

  React.useEffect(() => {
    if (contract) {
      addListener();
    }
  }, [contract]);

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

  const onClickSearch = async () => {
    if (hash.startsWith("0x")) setHash(hash.slice(2));

    const response = await axiosClient.get(`/product/${hash}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    setData(response.data);
  };
  return (
    <div
      className={`leading-normal tracking-normal text-indigo-400 bg-cover h-full m-0 ${styles.body_div} pt-36`}
    >
      <div className="container h-full mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
          <h1 className="my-4 text-3xl md:text-5xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
              Cold Supply Chain
            </span>
          </h1>
          <p className="leading-normal text-base md:text-1xl ml-5 font-bold mb-8 text-center md:text-left">
            From Medipol Blockhain Community
          </p>

          <form className="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-4">
            <ConnectButton
              account={account}
              connect={connect}
              web3={web3}
              className={
                "shadow bg-white cursor-pointer appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              }
              information={information}
            />
            {isAdmin && (
              <Link href="/admin">
                <div className="text-white mt-3 bg-blue-700 flex hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
                  <span className="montserrat font-bold mx-auto">
                    Go To Dashboard
                  </span>
                </div>
              </Link>
            )}
            <div className="relative flex w-full mx-auto h-14 my-3">
              <input
                onChange={(e) => setHash(e.target.value)}
                className="block p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
              />
              <div
                className="text-white cursor-pointer absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={onClickSearch}
              >
                Search
              </div>
            </div>
          </form>
        </div>

        <div className="w-full xl:w-3/5 p-12 overflow-hidden">
          <img
            className="mx-auto w-full md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6"
            src={content.src}
          />
        </div>
        {data && (
          <>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg justify-self-center mx-auto">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        Admin
                      </th>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4 text-right">{data.admin}</td>
                    </tr>
                    <tr class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        Current Carrier
                      </th>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4 text-right">
                        {data.currentCarrier}
                      </td>
                    </tr>
                    <tr class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        Name
                      </th>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4 text-right">{data.name}</td>
                    </tr>
                    <tr class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        Current Carrier
                      </th>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4 text-right">
                        {data.currentCarrier}
                      </td>
                    </tr>
                    <tr class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        Expiration Date
                      </th>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4"></td>
                      <td class="px-6 py-4 text-right">
                        {data.expirationDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {data?.problem.length != 0 && (
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg justify-self-center mx-auto my-10">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                          Carrier Address
                        </th>
                        <th scope="col" class="px-6 py-3"></th>
                        <th scope="col" class="px-6 py-3"></th>
                        <th scope="col" class="px-6 py-3"></th>
                        <th scope="col" class="px-6 py-3">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.problem.map((elem) => (
                        <tr class="border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700">
                          <th
                            scope="row"
                            class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                          >
                            {elem.carrier}
                          </th>
                          <td class="px-6 py-4"></td>
                          <td class="px-6 py-4"></td>
                          <td class="px-6 py-4"></td>
                          <td class="px-6 py-4 text-right">{elem.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
