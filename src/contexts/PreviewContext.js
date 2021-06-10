import React, { createContext, useContext, useState } from "react";

const PreviewContext = createContext();

export function usePreview() {
  return useContext(PreviewContext);
}

const PreviewProvider = ({ children }) => {
  const [title, changeTitle] = useState("");
  const [tags, changeTags] = useState([]);
  const [body, changeBody] = useState("");
  const [synopsis, changeSynopsis] = useState("");
  const [otherData, changeOther] = useState([]);
  const [genre, changeGenre] = useState("");
  const [nsfw, changeNsfw] = useState(false);
  const [error, changeError] = useState(false);
  const [uuid, changeUuid] = useState("");
  const [book, changeData] = useState({});

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
  function setBody(body) {
    changeBody(body);
  }
  function setOtherData(data) {
    changeOther(data);
  }
  function setUuid(data) {
    changeUuid(data);
  }
  function setBook(data) {
    changeData(data);
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
    body,
    setBody,
    otherData,
    setOtherData,
    uuid,
    setUuid,
    book,
    setBook,
  };
  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
};

export default PreviewProvider;
