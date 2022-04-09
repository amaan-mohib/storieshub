import "../styles/index.css";
import { useEffect } from "react";
import AuthProvider from "../src/contexts/AuthContext";

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
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
