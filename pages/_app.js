import "../styles/index.css";
import { useEffect } from "react";
import AuthProvider from "../src/contexts/AuthContext";
import SEO from "../src/components/Helmet";

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
