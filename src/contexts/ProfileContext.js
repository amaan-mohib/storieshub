import React, { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function useProfile() {
  return useContext(ProfileContext);
}

const ProfileProvider = ({ children }) => {
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [data, setData] = useState({
    displayName: "Loading",
    email: "Loading",
    photoURL:
      "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png",
    followers: [],
    following: [],
  });
  const [error, setError] = useState(null);

  const value = {
    data,
    setData,
    drafts,
    setDrafts,
    published,
    setPublished,
    error,
    setError,
  };
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export default ProfileProvider;
