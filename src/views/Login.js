import { useRouter } from "next/router";
import React, { useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import SEO from "../components/Helmet";
import Link from "../components/Link";
import { useAuth } from "../contexts/AuthContext";
import { auth, firebaseUIConfig } from "../firebase";

const Login = () => {
  const router = useRouter();
  const { from } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (from && user) {
      router.push(decodeURIComponent(from));
    }
  }, [user]);
  return (
    <div className="home">
      <SEO title="Login" />
      <SmallLogin />
    </div>
  );
};

export function SmallLogin() {
  const { user } = useAuth();

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
