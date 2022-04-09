import React, { useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import Link from "../components/Link";
import { useAuth } from "../contexts/AuthContext";
import { auth, firebaseUIConfig } from "../firebase";

const Login = () => {
  return (
    <div className="home">
      {/* <Helmet>
        <title>{`${appName} - Login`}</title>
      </Helmet> */}
      <SmallLogin />
    </div>
  );
};

export function SmallLogin() {
  const { user } = useAuth();
  useEffect(() => {
    // firebaseUI();
  }, []);
  return (
    <div className="login">
      <div className="comp">
        <h1>Login</h1>
        <p style={{ fontSize: "small", marginBottom: "25px" }}>
          Sign in to get creative.
        </p>
      </div>
      <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={auth} />
      {user && (
        <Link href="/" className="visited">
          <a>&lt; Home</a>
        </Link>
      )}
    </div>
  );
}
export default Login;
