import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { convertToRaw, EditorState } from "draft-js";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";
import Navbar from "../components/Navbar";
import PreviewProvider, { usePreview } from "../contexts/PreviewContext";
import { convertFromHTML } from "draft-convert";
import draftToHtml from "draftjs-to-html";
import FeatherIcon from "feather-icons-react";
import { genres } from "./Create";
import { isMobile } from "react-device-detect";
import ClickAwayListener from "react-click-away-listener";
import MessageMain from "../components/Message";
import Prs from "../components/Prs";
import PublishForm from "../components/PublishForm";
import { useRouter } from "next/router";
import SEO from "../components/Helmet";
import Members from "../components/Members";
import Requests from "../components/Requests";
import Accordion from "../components/Accordion";
import { createMarkup } from "../utils/utils";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Edit = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    let docRef = db.collection("books").doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (!doc.data().uids.includes(user.uid)) {
            router.replace("/");
          }
          setData(doc.data());
          // console.log(doc.data());
        } else {
          setError(true);
        }
      })
      .catch((err) => console.error(err));
  }, [id, user]);
  return (
    <PreviewProvider>
      <div>
        <SEO title="Edit" />
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
  const router = useRouter();
  const { id } = router.query;
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

const Preview = () => {
  const { title, body, mobileBody } = usePreview();

  return (
    <div className="preview-main">
      <div className="preview">
        <h1>{title}</h1>
        <hr />
        <p
          dangerouslySetInnerHTML={createMarkup(body + mobileBody)}
          style={{ textAlign: "justify" }}
          className="preview-body"></p>
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
