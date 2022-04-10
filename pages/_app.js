import "../styles/index.css";
import { useEffect } from "react";
import AuthProvider from "../src/contexts/AuthContext";
import SEO from "../src/components/Helmet";
import ProgressBar from "@badrap/bar-of-progress";
import { Router } from "next/router";

const progress = new ProgressBar({
  color: "var(--secondary-text)",
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const ls = localStorage.getItem("darkTheme");
    if (ls === "dark") {
      Object.keys(darkObj).map((key) => {
        const value = darkObj[key];
        document.documentElement.style.setProperty(key, value);
        return 0;
      });
    }
  }, []);
  return (
    <>
      <SEO />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
