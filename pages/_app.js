import TopNav from "../components/TopNav";
import { ToastContainer } from "react-toastify";
import { Provider } from "../context";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "../public/css/style.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
