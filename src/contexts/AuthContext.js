import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Loader from "../components/Loader";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  async function logout() {
    await auth.signOut();
    history.replace("/");
  }
  const value = {
    user,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
