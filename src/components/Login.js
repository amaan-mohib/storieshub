import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { firebaseUI } from "../firebase";

const Login = () => {
  return (
    <div className="home">
      <SmallLogin />
    </div>
  );
};

export function SmallLogin() {
  const { user } = useAuth();
  useEffect(() => {
    firebaseUI();
  }, []);
  return (
    <div className="login">
      <div className="comp">
        <h1>Login</h1>
        <p style={{ fontSize: "small", marginBottom: "25px" }}>
          Sign in to get creative.
        </p>
      </div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
      {user && <Link to="/">&lt; Home</Link>}
    </div>
  );
}
export default Login;
