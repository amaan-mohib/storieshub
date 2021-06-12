import React, { createContext, useContext, useState } from "react";

const PreviewContext = createContext();

export function usePreview() {
  return useContext(PreviewContext);
}

const PreviewProvider = ({ children }) => {
  const [title, changeTitle] = useState("");
  const [tags, changeTags] = useState([]);
  const [body, changeBody] = useState("");
  const [mobileBody, changeMobileBody] = useState("");
  const [synopsis, changeSynopsis] = useState("");
  const [otherData, changeOther] = useState([]);
  const [requests, changeRequests] = useState([]);
  const [genre, changeGenre] = useState("");
  const [nsfw, changeNsfw] = useState(false);
  const [error, changeError] = useState(false);
  const [uuid, changeUuid] = useState("");
  const [book, changeData] = useState({});
  const [render, changeRender] = useState(0);
  const [prs, changePrs] = useState(0);
  const [requested, changeRequested] = useState(false);
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
  function setRender(data) {
    changeRender(data);
  }
  function setMobileBody(data) {
    changeMobileBody(data);
  }
  function setPrs(data) {
    changePrs(data);
  }
  function setRequested(data) {
    changeRequested(data);
  }
  function setRequests(data) {
    changeRequests(data);
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
    render,
    setRender,
    mobileBody,
    setMobileBody,
    prs,
    setPrs,
    requested,
    setRequested,
    requests,
    setRequests,
  };
  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
};

export default PreviewProvider;
