import React from "react";

// CSS
import styles from "./style.module.css";

// Components
import MetamaskSVG from "components/ui/MetamaskSVG";

// react-icons
import { RiErrorWarningLine } from "react-icons/ri";

// Settings Modal
import { SettingsModal } from "components/ui/SettingsModal";

const ConnectButton = ({ account, connect, className, information }) => {
  const [inProgress, setInProgress] = React.useState(false);
  const [show, setShow] = React.useState(false);

  // Handle Click
  const handleClick = () => {
    if (!account?.data) {
      setInProgress(true);
      connect()
        .then(() => handleSignup())
        .catch(() => setInProgress(false))
        .finally(() => setInProgress(false));
    }
  };

  React.useEffect(() => {
    if (information) console.log(information);
  }, [information]);

  return (
    <div className="flex">
      <SettingsModal show={show} onHide={() => setShow(false)} />
      <div className={className}>
        <span onClick={handleClick} className="flex justify-center montserrat">
          {account?.data ? (
            <span className="font-bold">
              {String(account.data).slice(0, 10)}...
              {String(account.data).slice(-10)}
            </span>
          ) : inProgress ? (
            "In Progress..."
          ) : (
            <div
              className="mx-auto w-96 montserrat font-bold"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <MetamaskSVG />
              Connect with Metamask
            </div>
          )}
        </span>
      </div>
      {information &&
        information.email == "" &&
        information.notification == false && (
          <RiErrorWarningLine
            className="my-auto mx-2 cursor-pointer"
            size={25}
            color="red"
            onClick={() => setShow(true)}
          />
        )}
    </div>
  );
};

export default ConnectButton;
