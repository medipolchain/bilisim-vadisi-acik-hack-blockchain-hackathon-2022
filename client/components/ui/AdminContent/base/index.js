import React from "react";

// Axios Client
import { axiosClient } from "utils/axiosClient";

const AdminContent = ({ account, web3 }) => {
  const [name, setName] = React.useState("");
  const [currentCarrier, setCurrentCarrier] = React.useState("");
  const [date, setDate] = React.useState("");

  const onClick = async () => {
    let isValid = web3.utils.isAddress(currentCarrier);

    if (!isValid) alert("Please enter valid current carrier address");

    if (name.length == 0) alert("Name of Product can not be zero length");

    await axiosClient
      .post(
        "/product/create",
        {
          name,
          currentCarrier,
          expirationDate: date,
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
    <div>
      <p>AdminContent</p>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Name of Product"
        className="border-2 border-gray-400 p-2 w-64 rounded-md"
      />
      <div className="bg-green-500 p-2 hover:ring-8 transition duration-500 ring-green-400 rounded-sm text-white">
        <span className="montserrat font-bold">Create Product</span>
      </div>
    </div>
  );
};

export default AdminContent;
