import React from "react";

// Axios Client
import { axiosClient } from "utils/axiosClient";

import { toast } from "react-toastify";

const AdminContent = ({ account, web3, contract }) => {
  const [name, setName] = React.useState("");
  const [currentCarrier, setCurrentCarrier] = React.useState("");
  const [date, setDate] = React.useState("");

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const d = await axiosClient.get(`/product/all?publicAddress=${account}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(d);
      setData(d);
    };
    if (account && contract) fetchData();
  }, [account, contract]);

  const onClick = async () => {
    let isValid = web3.utils.isAddress(currentCarrier);

    let arr = date.split("/");
    let d = new Date();
    d.setMonth(arr[1]);
    d.setFullYear(arr[2]);

    let exDate = parseFloat(Math.round(d.getTime()) / 100).toFixed(0);

    if (!isValid)
      toast("Please enter valid carrier address!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
      });

    if (name.length == 0)
      toast("Please enter valid name for product!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
      });

    await axiosClient
      .post(
        "/product/create",
        {
          name,
          currentCarrier,
          expirationDate: exDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then((r) => console.log(r))
      .catch((er) => {
        if (er) console.log(er);
      });
  };

  return (
    <div className="grid container grid-cols-2 justify-center pt-10">
      <div className="flex flex-col">
        <p className="text-light montserrat text-2xl mx-auto">Create Product</p>
        <div className="mt-10 space-y-5 flex flex-col">
          <input
            className="block p-3 montserrat font-bold text-center pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Name Of Product"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="block p-3 montserrat font-bold text-center pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="First Carrier Address"
            onChange={(e) => setCurrentCarrier(e.target.value)}
          />

          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              datepicker
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 datepicker-input"
              placeholder="Select date"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="montserrat font-bold tracking-wider py-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 mx-auto rounded-lg text-sm px-5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={onClick}
          >
            Create !
          </button>
        </div>
      </div>
      <div className="text-center">
        <p className="text-light montserrat text-2xl mx-auto">View</p>
        <div className="flex my-auto mr-auto border-white border-4 rounded-xl overflow-hidden w-10/12 mx-auto">
          {data &&
            data?.data.map((elem) => (
              <div className=" bg-gray-700 py-7 rounded-xl w-full">
                <p className="text-center text-white font-bold montserrat tracking-wider">
                  ID : {elem._id}
                </p>
                <p className="text-white montserrat text-sm tracking-wider font-bold">
                  Current Currier : {elem.currentCarrier}
                </p>
                <p className="text-white montserrat text-sm tracking-wider font-bold">
                  In Progress : {!elem.isFinished ? "Yes" : "No"}
                </p>
                <p className="text-white montserrat text-sm tracking-wider font-bold">
                  Expiration Date: {elem.expirationDate}
                </p>
                <p
                  className="text-white montserrat tracking-wider font-bold"
                  style={{ fontSize: 10 }}
                >
                  Package ID : {elem.packageID}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
