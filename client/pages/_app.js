import "../styles/globals.css";

// Web3 Provider
import { Web3Provider } from "../components/providers";
import Layout from "components/ui/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Provider>
  );
}

export default MyApp;
