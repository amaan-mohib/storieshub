import React, { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function useProfile() {
  return useContext(ProfileContext);
}

const ProfileProvider = ({ children }) => {
  const [drafts, changeDrafts] = useState([]);
  const [published, changePublished] = useState([]);
  function setDrafts(title) {
    changeDrafts(title);
  }

  function setPublished(data) {
    changePublished(data);
  }
  const value = {
    drafts,
    setDrafts,
    published,
    setPublished,
  };
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export default ProfileProvider;
