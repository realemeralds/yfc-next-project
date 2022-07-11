import "../styles/globals.css";
import Navbar from "../components/Navbar";
import ScrollObserver from "../components/ScrollObserver";

// Font Awesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <ScrollObserver>
        <Component {...pageProps} />
      </ScrollObserver>
    </>
  );
}

export default MyApp;