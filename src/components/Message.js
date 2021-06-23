import React, { useEffect, useRef, useState } from "react";
import { usePreview } from "../contexts/PreviewContext";
import FeatherIcon from "feather-icons-react";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";
import { useParams } from "react-router-dom";
import { LoaderIcon } from "./Edit";

const MessageMain = () => {
  const { messages, setRead, read } = usePreview();
  const { id } = useParams();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    let readLength = messages.length;
    let docRef = db.collection("messages").doc(id);
    docRef
      .set(
        {
          [user.uid]: readLength,
        },
        { merge: true }
      )
      .then(() => {
        setRead(readLength);
      })
      .catch((err) => console.error(err));
    scrollRef.current.parentNode.scrollTop =
      scrollRef.current.offsetTop - scrollRef.current.parentNode.offsetTop;
  }, [read]);
  const onKeyDown = (e) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      send();
    }
  };
  const send = () => {
    if (input.trim() !== "") {
      setInput("");
      setLoading(true);
      let msgRef = db
        .collection("messages")
        .doc(id)
        .collection("messages")
        .doc();
      msgRef
        .set({
          id: msgRef.id,
          content: input,
          date: timestamp.serverTimestamp(),
          senderUid: user.uid,
          sender: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        })
        .then(() => {
          setRead(messages.length + 1);
          setLoading(false);
          scrollRef.current.parentNode.scrollTop =
            scrollRef.current.offsetTop -
            scrollRef.current.parentNode.offsetTop;
        })
        .catch((err) => console.error(err));
    }
  };
  return (
    <div className="message-main">
      <div className="message-body">
        <div ref={scrollRef}></div>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-whole${
                msg.senderUid === user.uid ? " message-whole-self" : ""
              }`}>
              <div
                className={`message${
                  msg.senderUid === user.uid ? " message-self" : ""
                }`}>
                <p className="message-sender">
                  {msg.senderUid !== user.uid && msg.sender.displayName}
                </p>
                <p>{msg.content}</p>
              </div>
              <p
                className={`message-time${
                  msg.senderUid === user.uid ? " message-time-self" : ""
                }`}>
                {msg.date && msg.date.toDate().toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>
      <div className="message-footer">
        <input
          placeholder="Type a message"
          autoFocus
          value={input}
          onKeyDown={onKeyDown}
          onChange={(e) => setInput(e.target.value)}
          className="textfield"
          style={{ width: "calc(100% - 45px)" }}
          type="text"
        />
        <div
          disabled={input.trim() === ""}
          className="icon-button"
          onClick={send}>
          {!loading ? (
            <FeatherIcon icon="send" />
          ) : (
            <div style={{ marginLeft: "-5px" }}>{LoaderIcon}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageMain;
