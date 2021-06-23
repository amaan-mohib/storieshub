import { convertToRaw, EditorState } from "draft-js";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useHistory, useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";
import Navbar from "./Navbar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link } from "react-router-dom";
import PreviewProvider, { usePreview } from "../contexts/PreviewContext";
import { convertFromHTML } from "draft-convert";
import DOMPurify from "dompurify";
import draftToHtml from "draftjs-to-html";
import FeatherIcon from "feather-icons-react";
import short from "short-uuid";
import { genres } from "./Create";
import { isMobile } from "react-device-detect";
import ClickAwayListener from "react-click-away-listener";
import MessageMain from "./Message";
import Prs from "./Prs";
import PublishForm from "./PublishForm";

const Edit = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    let docRef = db.collection("books").doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (!doc.data().uids.includes(user.uid)) {
            history.replace("/");
          }
          setData(doc.data());
          console.log(doc.data());
        } else {
          setError(true);
        }
      })
      .catch((err) => console.error(err));
  }, [id, user, history]);
  return (
    <PreviewProvider>
      <div>
        <Navbar />
        {error ? (
          <div className="main">No book with ID {id}</div>
        ) : (
          Object.keys(data).length !== 0 && <TopComp data={data} />
        )}
      </div>
    </PreviewProvider>
  );
};
const TopComp = ({ data }) => {
  const { setMessages, setRead } = usePreview();
  const { id } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    let docRef = db.collection("messages").doc(id);
    let msgRef = docRef.collection("messages");
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let uid = user.uid;
          doc.data()[uid] && setRead(doc.data()[uid]);
        }
      })
      .catch((err) => console.error(err));
    let unsub = msgRef.orderBy("date", "desc").onSnapshot((query) => {
      const docs = query.docs.map((doc) => doc.data());
      setMessages(docs);
    });
    return () => {
      unsub && unsub();
    };
  }, []);
  return (
    <>
      <div className="create">
        <TextEditor data={data} />
      </div>
      <div className="create-mob">
        <Mobile data={data} />
      </div>
    </>
  );
};
export const LoaderIcon = (
  <div
    className="loader"
    style={{
      width: "15px",
      height: "15px",
      borderWidth: "3px",
      marginLeft: "5px",
    }}
  />
);
const TextEditor = ({ data }) => {
  const {
    title,
    setTitle,
    synopsis,
    setSynopsis,
    body,
    setBody,
    error,
    setError,
    setOtherData,
    setUuid,
    tags,
    setTags,
    genre,
    setGenre,
    book,
    setBook,
    render,
    setRender,
    mobileBody,
    setPrs,
    setRequested,
    setRequests,
    setNsfw,
  } = usePreview();
  const { user } = useAuth();
  const previewRef = useRef(null);
  const editorRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);
  const [update, setUpdate] = useState(new Date().toLocaleDateString());
  const [open, setOpen] = useState(false);
  const [publishOpen, setPubOpen] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(convertFromHTML(body))
  );
  const handleEditorState = (state) => {
    setEditorState(state);
    setBody(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    editorRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "end",
      block: "end",
    });
  };
  useEffect(() => {
    if (render === 0 && Object.keys(data).length !== 0) {
      setTitle(data.title);
      data.synopsis && setSynopsis(data.synopsis);
      if (data) {
        setBook(data);
      }
      if (data.body && data.leader === user.uid) {
        setBody(data.body);
        setEditorState(() =>
          EditorState.createWithContent(convertFromHTML(data.body))
        );
      }
      data.authors && setOtherData(data.authors);
      data.tags && setTags(data.tags);
      data.genre && setGenre(data.genre);
      data.joinID && setUuid(data.joinID);
      data.updatedAt && setUpdate(data.updatedAt.toDate().toLocaleString());
      data.pr && setPrs(data.pr);
      data.requested && setRequested(data.requested);
      data.requests && setRequests(data.requests);
      data.nsfw && setNsfw(data.nsfw);
      setEditorState((e) => EditorState.moveFocusToEnd(e));
      setRender(1);
    }

    return () => {
      if (data.leader === user.uid && !publishOpen && !validation()) {
        saveBook();
      }
    };
    // eslint-disable-next-line
  }, [data]);
  const validation = () => {
    if (title.trim() === "" || body.replace(/<\/?[^>]+>/gi, "").trim() === "") {
      setError(true);
      return true;
    } else {
      setError(false);
      return false;
    }
  };
  const saveBook = () => {
    setLoading(true);
    let docRef = db.collection("books").doc(data.id);
    docRef
      .set(
        {
          title: title,
          synopsis: synopsis,
          body: `${body.trim()}<p>${mobileBody.trim()}</p>`,
          updatedAt: timestamp.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        setUpdate(new Date().toLocaleString());
        setLoading(false);
        setSave(false);
        console.log("saved");
      })
      .catch((err) => console.error(err));
  };
  const savePr = () => {
    setLoading(true);
    let docRef = db.collection("books").doc(data.id);
    docRef
      .set(
        {
          pr: timestamp.increment(1),
        },
        { merge: true }
      )
      .then(() => {
        let newDoc = docRef.collection("prs").doc();
        newDoc
          .set({
            prId: newDoc.id,
            title: title,
            synopsis: synopsis,
            body: `${body.trim()}<p>${mobileBody.trim()}</p>`,
            updatedAt: timestamp.serverTimestamp(),
            authorUid: user.uid,
            author: {
              id: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
          })
          .then(() => {
            setLoading(false);
            setSave(false);
            console.log("saved pr");
          })
          .catch((err) => console.error(err));
      });
  };

  return (
    <>
      <div className="main edit-main">
        <div className="feeds">
          {open && (
            <div className="dialog-bg">
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div className="dialog">
                  <div className="dialog-title">
                    <h1>{`${data.title}`}</h1>
                    <div className="icon-button" onClick={() => setOpen(false)}>
                      <FeatherIcon icon="x" />
                    </div>
                  </div>
                  <hr />
                  <div
                    className="dialog-body"
                    dangerouslySetInnerHTML={createMarkup(data.body)}></div>
                  <hr />
                  <div className="dialog-actions">
                    <div>
                      <button
                        className="button secondary-but"
                        onClick={() => setOpen(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            </div>
          )}
          {publishOpen && (
            <div className="dialog-bg">
              <ClickAwayListener onClickAway={() => setPubOpen(false)}>
                <div>
                  <PublishForm
                    data={data}
                    close1={
                      <div
                        className="icon-button"
                        onClick={() => setPubOpen(false)}>
                        <FeatherIcon icon="x" />
                      </div>
                    }
                    close2={
                      <button
                        className="button secondary-but"
                        onClick={() => setPubOpen(false)}>
                        Close
                      </button>
                    }
                  />
                </div>
              </ClickAwayListener>
            </div>
          )}
          <div className="feed sticky1" style={{ margin: 0 }}>
            <div className="footer">
              {book.leader === user.uid && (
                <button
                  className="button"
                  style={{ marginRight: "10px" }}
                  onClick={() => {
                    if (!validation()) {
                      saveBook();
                      setPubOpen(true);
                    }
                  }}>
                  Publish
                </button>
              )}
              {book.leader === user.uid ? (
                <button
                  disabled={loading}
                  onClick={() => {
                    if (!validation()) {
                      setSave(true);
                      saveBook();
                    }
                  }}
                  className="button secondary-but but-outline"
                  style={{ marginRight: "10px" }}>
                  Save
                  {loading && save && LoaderIcon}
                </button>
              ) : (
                <div className="footer">
                  <button
                    disabled={loading}
                    onClick={() => {
                      if (!validation()) {
                        setSave(true);
                        savePr();
                      }
                    }}
                    className="button"
                    style={{ marginRight: "10px" }}>
                    Submit
                    {loading && save && LoaderIcon}
                  </button>
                  <button
                    onClick={() => {
                      setOpen(true);
                    }}
                    className="button secondary-but but-outline"
                    style={{ marginRight: "10px" }}>
                    Draft
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setPreview(true);
                  console.log(previewRef.current);
                  setTimeout(() => {
                    previewRef.current.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="button secondary-but">
                Preview
              </button>
            </div>
            {data.updatedAt && (
              <p
                style={{
                  fontSize: "small",
                  color: "var(--secondary-text)",
                  marginTop: "10px",
                }}>
                Updated: {update}
              </p>
            )}
            {error && (
              <div className="error">*Please fill the required fields</div>
            )}
          </div>
          <div className="feed">
            <input
              title="Title"
              type="text"
              name="title"
              className="textfield title-field"
              placeholder={`Title${error ? "*" : ""}`}
              value={title}
              style={{ width: "100%" }}
              onChange={(e) => setTitle(e.target.value)}
            />

            {isMobile ? (
              <MobileEditor />
            ) : (
              <Editor
                editorState={editorState}
                placeholder={`Write your story...${error ? "*" : ""}`}
                editorClassName="editor-class"
                wrapperClassName="wrapper-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "fontSize",
                    "list",
                    "textAlign",
                    "history",
                  ],
                  inline: { inDropdown: true },
                  list: { inDropdown: true },
                  textAlign: { inDropdown: true },
                  link: { inDropdown: true },
                  history: { inDropdown: true },
                }}
                onEditorStateChange={handleEditorState}
              />
            )}

            <div className="keywords" ref={editorRef}>
              <p>
                <b>{genres[Number(genre)]}</b>
              </p>
              {tags.map((k, index) => (
                <p key={`k-${index}`}>{k}</p>
              ))}
            </div>
            <textarea
              title="Synopsis"
              name="synopsis"
              type="text"
              placeholder="Synopsis"
              rows="5"
              className="textfield"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              style={{ width: "100%", resize: "none" }}
            />
          </div>
        </div>
        <Sidebar />
      </div>
      <div ref={previewRef}></div>
      {preview && (
        <>
          <Preview />
          <div
            title="Preview Off"
            className="fab"
            onClick={() => {
              editorRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "end",
                block: "end",
              });
              setPreview(false);
            }}>
            <FeatherIcon icon="eye-off" />
          </div>
        </>
      )}
    </>
  );
};
const MobileEditor = () => {
  const { body, mobileBody, setMobileBody } = usePreview();

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  const handleChange = (e) => {
    setMobileBody(e.target.value);
  };
  return (
    <div className="textfield mobile-body" style={{ marginRight: 0 }}>
      <span
        className="mobile-body-span"
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={createMarkup(body)}></span>
      <p
        style={{
          fontSize: "x-small",
          color: "var(--secondary-text)",
          marginTop: "5px",
        }}>
        Unfortunately, rich text editors are not well supported in mobile
        devices. So, please consider writing your story in the field below
      </p>
      <textarea
        autoFocus
        title="Story"
        name="body"
        type="text"
        value={mobileBody}
        onChange={handleChange}
        placeholder="Continue your story..."
        className="textfield"
        style={{ width: "100%", resize: "none" }}
      />
    </div>
  );
};
export const createMarkup = (html) => {
  return {
    __html: DOMPurify.sanitize(html),
  };
};
const Preview = () => {
  const { title, body, mobileBody } = usePreview();

  return (
    <div className="preview-main">
      <div className="preview">
        <h1>{title}</h1>
        <hr />
        <p
          dangerouslySetInnerHTML={createMarkup(body + mobileBody)}
          style={{ textAlign: "justify" }}></p>
      </div>
    </div>
  );
};
const Sidebar = () => {
  const [tab, setTab] = useState(0);
  const { read, messages } = usePreview();
  const tabs = [
    { icon: "users", title: "Team" },
    { icon: "message-circle", title: "Message" },
  ];
  const activeClass = (index) => {
    return tab === index ? " tab-active" : "";
  };
  return (
    <div className="sticky sidebar">
      <div className="tabs">
        {tabs.map((t, index) => (
          <button
            key={`b-${index}`}
            className={`dropdown-item tab-icon${activeClass(index)}`}
            onClick={() => setTab(index)}
            title={t.title}>
            <FeatherIcon
              icon={t.icon}
              className={`${
                activeClass(index) === " tab-active" ? "tab-active-icon" : ""
              }`}
            />
            {messages.length - read !== 0 && index === 1 && (
              <p className="badge">{Number(messages.length) - Number(read)}</p>
            )}
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {tab === 0 ? <SidebarContent /> : <Message />}
      </div>
    </div>
  );
};
const Accordion = ({ title, component, isOpen = false, notification = 0 }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="accordion members">
      <div className="accordion-title" onClick={() => setOpen(!open)}>
        <h3 className="heading-h3">
          {title}
          {notification !== 0 && <p className="badge">{notification}</p>}
        </h3>
        <div className="icon-button">
          <FeatherIcon icon={open ? "chevron-up" : "chevron-down"} />
        </div>
      </div>
      {open && (
        <div>
          <hr />
          {component}
        </div>
      )}
    </div>
  );
};
const Members = () => {
  const {
    otherData,
    title,
    tags,
    uuid,
    setUuid,
    book,
    requested,
    setRequested,
    genre,
  } = usePreview();
  const [show, setShow] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const [shortId, setShortId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateUuid = () => {
    const transalator = short();
    const uuid = transalator.generate();
    const uid = transalator.toUUID(uuid);
    setShortId(transalator.fromUUID(uid));
    setUuid(uid);
    let docRef = db.collection("books").doc(id);
    docRef
      .set(
        {
          joinID: uid,
        },
        { merge: true }
      )
      .then(() => {
        setShow(false);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (uuid && uuid !== "") {
      const transalator = short();
      setShortId(transalator.fromUUID(uuid));
      setShow(false);
    }
  }, [uuid]);
  const requestMembers = () => {
    let docRef = db.collection("books").doc(id);
    let reqRef = db.collection("requests").doc(id);
    setLoading(true);
    docRef
      .set(
        {
          requested: true,
        },
        { merge: true }
      )
      .then(() => {
        reqRef
          .set({
            teamId: id,
            title: title,
            tags: tags,
            leader: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            updatedAt: timestamp.serverTimestamp(),
            members: otherData.length,
            genre: genre,
          })
          .then(() => {
            setRequested(true);
            setLoading(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const deleteRequest = () => {
    let docRef = db.collection("books").doc(id);
    let reqRef = db.collection("requests").doc(id);
    docRef
      .set(
        {
          requested: false,
        },
        { merge: true }
      )
      .then(() => {
        reqRef
          .delete()
          .then(() => {
            setRequested(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const share = (url) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Invite link - StoriesHub",
          text: `Hi! You have been invited to join a team on StoriesHub by ${user.displayName}`,
          url: url,
        })
        .then(() => console.log("shared"))
        .catch((err) => console.error(err));
    }
  };
  const copy = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => console.log("copied"))
        .catch((err) => console.error(err));
    }
  };
  return (
    <div>
      <ul className="team-members">
        {otherData.map((a) => (
          <li className="team-member" key={a.id}>
            <img
              referrerPolicy="no-referrer"
              src={
                a.photoURL
                  ? a.photoURL
                  : "https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
              }
              alt="profile"
              className="pfp nav-img"
            />
            <Link to={`/profile/${a.id}`} className="feed-author">
              {a.displayName}
            </Link>
          </li>
        ))}
      </ul>
      {book.leader === user.uid && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!show && (
            <p>
              <a
                style={{ fontSize: "x-small", marginTop: "10px" }}
                href={`${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`}
                target="_blank"
                rel="noopener noreferrer">
                {`${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`}
              </a>
            </p>
          )}
          {show ? (
            <button
              className="button secondary-but but-outline"
              onClick={generateUuid}
              style={{ justifyContent: "center", marginTop: "10px" }}>
              <FeatherIcon icon="link-2" />
              Invite via link
            </button>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <button
                  className="button secondary-but"
                  onClick={() => {
                    copy(`${shortId}`);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 1000);
                  }}
                  style={{ justifyContent: "center", marginTop: "10px" }}>
                  <FeatherIcon icon="copy" />
                  Copy Code{" "}
                  {copied && (
                    <FeatherIcon icon="check" style={{ margin: "0 0 0 5px" }} />
                  )}
                </button>
                <button
                  className="button secondary-but"
                  onClick={() => {
                    share(
                      `${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`
                    );
                  }}
                  style={{ justifyContent: "center", marginTop: "10px" }}>
                  <FeatherIcon icon="share-2" />
                  Share
                </button>
              </div>
              <button
                className="button secondary-but but-outline"
                onClick={generateUuid}
                style={{ justifyContent: "center", marginTop: "10px" }}>
                <FeatherIcon icon="refresh-ccw" />
                Generate new link
              </button>
            </>
          )}
          {!requested ? (
            <button
              className="button secondary-but but-outline"
              onClick={requestMembers}
              style={{ justifyContent: "center", marginTop: "10px" }}>
              <FeatherIcon icon="user-plus" />
              Request Members{loading && LoaderIcon}
            </button>
          ) : (
            <button
              className="button secondary-but but-outline"
              onClick={deleteRequest}
              style={{ justifyContent: "center", marginTop: "10px" }}>
              <FeatherIcon icon="user-x" />
              Remove Request
            </button>
          )}
        </div>
      )}
    </div>
  );
};
const Requests = () => {
  const { requests, setOtherData, setRequests } = usePreview();
  const { id } = useParams();
  const approve = (author, uid) => {
    let docRef = db.collection("books").doc(id);
    docRef
      .set(
        {
          authors: timestamp.arrayUnion({
            displayName: author.displayName,
            id: author.id,
            photoURL: author.photoURL,
            leader: false,
          }),
          uids: timestamp.arrayUnion(uid),
          requests: timestamp.arrayRemove({
            displayName: author.displayName,
            id: author.id,
            photoURL: author.photoURL,
            leader: false,
          }),
          requestUids: timestamp.arrayRemove(uid),
        },
        { merge: true }
      )
      .then(() => {
        db.collection("requests")
          .doc(id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("requests")
                .doc(id)
                .set(
                  {
                    members: timestamp.increment(1),
                  },
                  { merge: true }
                )
                .catch((err) => console.error(err));
            }
            db.collection("users")
              .doc(`${uid}`)
              .set(
                {
                  books: timestamp.arrayUnion(uid),
                },
                { merge: true }
              );
          })
          .then(() => {
            setOtherData((d) => [...d, author]);
            setRequests((d) => d.filter((data) => data.id !== uid));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const deny = (author, uid) => {
    let docRef = db.collection("books").doc(id);
    docRef
      .set(
        {
          requests: timestamp.arrayRemove(author),
          requestUids: timestamp.arrayRemove(uid),
        },
        { merge: true }
      )
      .then(() => {
        setRequests((d) => d.filter((data) => data.id !== uid));
      })
      .catch((err) => console.error(err));
  };
  return requests.length > 0 ? (
    <div>
      <ul className="team-members">
        {requests.map((data, index) => (
          <li className="team-member request" key={data.id}>
            <div className="team-member-div">
              <img
                referrerPolicy="no-referrer"
                src={
                  data.photoURL ||
                  "https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
                }
                alt="profile"
                className="pfp nav-img"
              />
              <Link
                to={`/profile/${data.id}`}
                className="feed-author">{`${data.displayName}`}</Link>
            </div>
            <div>
              <p className="link" onClick={() => approve(data, data.id)}>
                Approve
              </p>
              <p className="link" onClick={() => deny(data, data.id)}>
                Deny
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>No Join Requests</p>
  );
};

const Message = () => {
  return <MessageMain />;
};
const SidebarContent = () => {
  const { prs, book, requests } = usePreview();
  const { user } = useAuth();
  return (
    <div className="sidebarContent">
      <Accordion component={<Members />} title="Team Members" isOpen={true} />
      {book.leader === user.uid && (
        <Accordion
          component={<Requests />}
          title="Join Requests"
          notification={requests.length}
        />
      )}
      <Accordion
        component={<Prs />}
        title="Submit Requests"
        notification={prs}
      />
    </div>
  );
};
const Mobile = ({ data }) => {
  const [tab, setTab] = useState(0);
  const { messages, read } = usePreview();
  const tabs = [
    { icon: "book", title: "Edit" },
    { icon: "users", title: "Team" },
    { icon: "message-circle", title: "Message" },
  ];
  const activeClass = (index) => {
    return tab === index ? " tab-active" : "";
  };
  const comps = [<TextEditor data={data} />, <SidebarContent />, <Message />];
  return (
    <div className="main" style={{ flexDirection: "column" }}>
      <div className="tabs edit-tab">
        {tabs.map((t, index) => (
          <button
            key={`t-${index}`}
            className={`dropdown-item tab-icon${activeClass(index)}`}
            onClick={() => setTab(index)}
            title={t.title}>
            <FeatherIcon
              icon={t.icon}
              className={`${
                activeClass(index) === " tab-active" ? "tab-active-icon" : ""
              }`}
            />
            {messages.length - read !== 0 && index === 2 && (
              <p className="badge">{Number(messages.length) - Number(read)}</p>
            )}
          </button>
        ))}
      </div>
      <div className="create-mob-main">{comps[tab]}</div>
    </div>
  );
};
export default Edit;
