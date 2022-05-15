import React, { createRef } from "react";

// CSS
import styles from "./style.module.css";

// axios
import { axiosClient } from "utils/axiosClient";

// Bootstrap
import { Modal, Spinner } from "react-bootstrap";

const SettingsModal = ({ show, onHide }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const [input, setInput] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    setIsLoading(true);

    await axiosClient
      .post(
        "/user/settings",
        {
          isChecked,
          input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )

      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })

      .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        <p className="montserrat text-center font-bold">
          Sign Up for E-mail Notification
        </p>

        <div className="relative w-full mb-2 mt-3">
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5 dark:border-gray-600  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="E-mail Address"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <button
            class="bg-gradient-to-r justify-center from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
            type="button"
          >
            {isLoading ? <Spinner animation="grow" /> : "Save"}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
