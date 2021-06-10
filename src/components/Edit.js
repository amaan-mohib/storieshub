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

const Edit = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    let docRef = db.collection("books").doc(id);
    let unsub = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        if (!doc.data().uids.includes(user.uid)) {
          history.replace("/");
        }
        setData(doc.data());
        console.log(doc.data());
      } else {
        setError(true);
      }
    });
    return () => {
      unsub && unsub();
    };
  }, [id, user, history]);
  return (
    <PreviewProvider>
      <div>
        <Navbar />
        {error ? (
          <div className="main">No book with ID {id}</div>
        ) : (
          <>
            <div className="create">
              <TextEditor data={data} />
            </div>
            <div className="create-mob">
              <Mobile data={data} />
            </div>
          </>
        )}
      </div>
    </PreviewProvider>
  );
};

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
  } = usePreview();
  const previewRef = useRef(null);
  const editorRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);
  const [publish, setPublish] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
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
    setTitle(data.title);
    data.synopsis && setSynopsis(data.synopsis);
    if (data) {
      setBook(data);
    }
    if (data.body) {
      setBody(data.body);
      setEditorState(() =>
        EditorState.createWithContent(convertFromHTML(data.body))
      );
    }
    data.authors && setOtherData(data.authors);
    data.tags && setTags(data.tags);
    data.genre && setGenre(data.genre);
    data.joinID && setUuid(data.joinID);
    setEditorState((e) => EditorState.moveFocusToEnd(e));
  }, [data]);
  const validation = () => {
    if (
      title.trim() === "" ||
      body.trim() === "" ||
      body.trim() === "<p></p>" ||
      body.trim() === "<p>&nbsp;</p>"
    ) {
      setError(true);
      return true;
    } else {
      setError(false);
      return false;
    }
  };
  const saveBook = () => {
    let docRef = db.collection("books").doc(data.id);
    docRef
      .set(
        {
          title: title,
          synopsis: synopsis,
          body: body,
          updatedAt: timestamp.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        setLoading(false);
        setSave(false);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <div className="main edit-main" ref={previewRef}>
        <div className="feeds">
          <div className="feed sticky" style={{ margin: 0 }}>
            <div className="footer">
              <button className="button" style={{ marginRight: "10px" }}>
                Publish
                {loading && publish && (
                  <div
                    className="loader"
                    style={{
                      width: "15px",
                      height: "15px",
                      borderWidth: "3px",
                      marginLeft: "5px",
                    }}
                  />
                )}
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  if (!validation()) {
                    setLoading(true);
                    setSave(true);
                    saveBook();
                  }
                }}
                className="button secondary-but but-outline"
                style={{ marginRight: "10px" }}>
                Save
                {loading && save && (
                  <div
                    className="loader"
                    style={{
                      width: "15px",
                      height: "15px",
                      borderWidth: "3px",
                      marginLeft: "5px",
                    }}
                  />
                )}
              </button>
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
                Updated: {data.updatedAt.toDate().toLocaleString()}
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
            <div>
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
            </div>
            <div className="keywords">
              <p>
                <b>{genres[Number(genre)]}</b>
              </p>
              {tags.map((k) => (
                <p>{k}</p>
              ))}
            </div>
            <textarea
              ref={editorRef}
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
const Preview = () => {
  const { title, body } = usePreview();
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <div className="preview-main">
      <div className="preview">
        <h1>{title}</h1>
        <hr />
        <p
          dangerouslySetInnerHTML={createMarkup(body)}
          style={{ textAlign: "justify" }}></p>
      </div>
    </div>
  );
};
const Sidebar = () => {
  const [tab, setTab] = useState(0);
  const tabs = [
    { icon: "users", title: "Team" },
    { icon: "message-circle", title: "Message" },
  ];
  const activeClass = (index) => {
    return tab === index ? " tab-active" : "";
  };
  return (
    <div className="sidebar sticky">
      <div className="tabs">
        {tabs.map((t, index) => (
          <button
            className={`dropdown-item tab-icon${activeClass(index)}`}
            onClick={() => setTab(index)}
            title={t.title}>
            <FeatherIcon
              icon={t.icon}
              className={`${
                activeClass(index) === " tab-active" ? "tab-active-icon" : ""
              }`}
            />
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {tab === 0 ? <Members /> : <Message />}
      </div>
    </div>
  );
};
const Members = () => {
  const { otherData, uuid, setUuid, book } = usePreview();
  const [show, setShow] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const [shortId, setShortId] = useState("");
  const [copied, setCopied] = useState(false);
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
      .then(() => {})
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (uuid && uuid != "") {
      const transalator = short();
      setShortId(transalator.fromUUID(uuid));
      setShow(false);
    }
  }, [uuid]);
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
    <div className="members">
      <h3 className="heading-h3">Team Members</h3>
      <hr />
      <ul className="team-members">
        {otherData.map((a, index) => (
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
                style={{ fontSize: "small", marginTop: "10px" }}
                href={`${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`}
                target="_blank"
                rel="noopener noreferrer">
                {`${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`}
              </a>
            </p>
          )}
          {otherData.length <= 4 && show ? (
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
        </div>
      )}
    </div>
  );
};
const Message = () => {
  return <div></div>;
};

const Mobile = ({ data }) => {
  const [tab, setTab] = useState(0);
  const tabs = [
    { icon: "book", title: "Edit" },
    { icon: "users", title: "Team" },
    { icon: "message-circle", title: "Message" },
  ];
  const activeClass = (index) => {
    return tab === index ? " tab-active" : "";
  };
  const comps = [<TextEditor data={data} />, <Members />, <Message />];
  return (
    <div className="main" style={{ flexDirection: "column" }}>
      <div className="tabs edit-tab">
        {tabs.map((t, index) => (
          <button
            className={`dropdown-item tab-icon${activeClass(index)}`}
            onClick={() => setTab(index)}
            title={t.title}>
            <FeatherIcon
              icon={t.icon}
              className={`${
                activeClass(index) === " tab-active" ? "tab-active-icon" : ""
              }`}
            />
          </button>
        ))}
      </div>
      <div className="create-mob-main">{comps[tab]}</div>
    </div>
  );
};
export default Edit;
