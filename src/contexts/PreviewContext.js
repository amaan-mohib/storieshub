import React, { createContext, useContext, useState } from "react";

const PreviewContext = createContext();

export function usePreview() {
  return useContext(PreviewContext);
}

const PreviewProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState("");
  const [mobileBody, setMobileBody] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [otherData, setOtherData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [genre, setGenre] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [error, setError] = useState(false);
  const [uuid, setUuid] = useState("");
  const [book, setBook] = useState({});
  const [render, setRender] = useState(0);
  const [prs, setPrs] = useState(0);
  const [requested, setRequested] = useState(false);
  const [messages, setMessages] = useState([]);
  const [read, setRead] = useState(0);

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
    messages,
    setMessages,
    read,
    setRead,
  };
  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
};

export default PreviewProvider;
