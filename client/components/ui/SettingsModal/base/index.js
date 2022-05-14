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
    <Modal show={show} onHide={onHide}>
      <Modal.Body>
        <p className="montserrat text-center font-bold my-6">Settings</p>
        <div className="mx-auto flex justify-center gap-3">
          <input
            id="remember"
            type="checkbox"
            onClick={() => setIsChecked(!isChecked)}
            className="w-4 h-4 border border-gray-300 my-auto rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            required
          ></input>
          <p className="montserrat text-md my-auto">Email Notification</p>
        </div>

        <form className="flex items-center my-2">
          <label className="sr-only">Search</label>
          <div className="relative w-full">
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5 dark:border-gray-600  dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              onChange={(e) => setInput(e.target.value)}
              disabled={!isChecked}
            />
          </div>
        </form>
        <div className="w-28 bg-green-500 cursor-pointer p-2 mt-2 justify-center flex mx-auto rounded-md">
          <span className="montserrat text-center text-white" onClick={onClick}>
            {isLoading ? <Spinner animation="grow" /> : "Save"}
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
