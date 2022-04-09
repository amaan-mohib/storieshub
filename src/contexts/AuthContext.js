import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { auth, db, timestamp } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        let docRef = db.collection("users").doc(`${user.uid}`);
        docRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("read");
              docRef
                .set(
                  {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    email: user.email,
                    createdAt: timestamp.serverTimestamp(),
                  },
                  { merge: true }
                )
                .catch((err) => console.error(err));
            }
          })
          .catch((err) => console.error(err));
      }
    });
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  async function logout() {
    await auth.signOut();
    router.replace("/");
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
