import "../styles/globals.css";

// Web3 Provider
import { Web3Provider } from "../components/providers";
import Layout from "components/ui/Layout";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// React-toastify
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;
