import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export function useForm() {
  return useContext(FormContext);
}

const FormProvider = ({ children }) => {
  const [title, changeTitle] = useState("");
  const [tags, changeTags] = useState([]);
  const [synopsis, changeSynopsis] = useState("");
  const [genre, changeGenre] = useState("");
  const [nsfw, changeNsfw] = useState(false);
  const [error, changeError] = useState(false);

  function setTitle(title) {
    changeTitle(title);
  }
  function setTags(title) {
    changeTags(title);
  }
  function setSynopsis(title) {
    changeSynopsis(title);
  }
  function setGenre(title) {
    changeGenre(title);
  }
  function setNsfw(title) {
    changeNsfw(title);
  }
  function setError(err) {
    changeError(err);
  }
  const value = {
    title,
    setTitle,
    tags,
    setTags,
    synopsis,
    setSynopsis,
    genre,
    setGenre,
    nsfw,
    setNsfw,
    error,
    setError,
  };
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export default FormProvider;
