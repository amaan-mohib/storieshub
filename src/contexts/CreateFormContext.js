import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export function useForm() {
  return useContext(FormContext);
}

const FormProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [synopsis, setSynopsis] = useState("");
  const [genre, setGenre] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [error, setError] = useState(false);

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
