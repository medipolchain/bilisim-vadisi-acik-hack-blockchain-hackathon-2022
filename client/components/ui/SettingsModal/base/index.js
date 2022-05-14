import React from "react";

// CSS
import styles from "./style.module.css";

// Bootstrap
import { Modal } from "react-bootstrap";

const SettingsModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body>
        <p>Settings Modal</p>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
