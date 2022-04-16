import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { convertToRaw, EditorState } from "draft-js";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import PreviewProvider, { usePreview } from "../contexts/PreviewContext";
import { convertFromHTML } from "draft-convert";
import draftToHtml from "draftjs-to-html";
import FeatherIcon from "feather-icons-react";
import { genres } from "./Create";
import { isMobile } from "react-device-detect";
import MessageMain from "../components/Message";
import Prs from "../components/Prs";
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
import { types } from "../contexts/PreviewReducer";

const Edit = () => {
  return (
    <PreviewProvider>
      <SEO title="Edit" />
      <Navbar isEdit />
      <EditComp />
    </PreviewProvider>
  );
};

const EditComp = () => {
  const { user } = useAuth();
  const { dispatch } = usePreview();
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState(false);

  useEffect(() => {
    let docRef = db.collection("books").doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (!doc.data().uids.includes(user.uid)) {
            router.replace("/");
          }
          dispatch({ type: types.UPDATE_BOOK, payload: doc.data() });
          // console.log(doc.data());
        } else {
          setError(true);
        }
      })
      .catch((err) => console.error(err));
  }, [id, user]);

  if (error) return <div className="main">No book with ID {id}</div>;
  return <TopComp />;
};
const TopComp = () => {
  const { dispatch } = usePreview();
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
          doc.data()[uid] &&
            dispatch({ type: types.SET_READ, payload: doc.data()[uid] });
        }
      })
      .catch((err) => console.error(err));
    let unsub = msgRef.orderBy("date", "desc").onSnapshot((query) => {
      const docs = query.docs.map((doc) => doc.data());
      dispatch({ type: types.SET_MESSAGES, payload: docs });
    });
    return () => {
      unsub && unsub();
    };
  }, []);
  return (
    <>
      <div className="create">
        <TextEditor />
      </div>
      <div className="create-mob">
        <Mobile />
      </div>
    </>
  );
};

const TextEditor = () => {
  const { state, dispatch } = usePreview();
  const previewRef = useRef(null);
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(convertFromHTML(""))
  );

  const handleEditorState = useCallback(
    (state) => {
      let body = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      setEditorState(state);
      dispatch({ type: types.UPDATE_BODY, payload: body });
    },
    [editorState]
  );

  useEffect(() => {
    dispatch({ type: types.SET_PREVIEW_REF, payload: previewRef.current });
  }, [previewRef]);

  useEffect(() => {
    if (state.book.body && state.book.leader === user.uid) {
      setEditorState(() =>
        EditorState.createWithContent(convertFromHTML(state.book.body))
      );
    } else {
      dispatch({ type: types.UPDATE_BODY, payload: "" });
    }
    setEditorState((e) => EditorState.moveFocusToEnd(e));
  }, [state.book.leader, user]);

  const updateTitle = (e) => {
    let title = e.target.value;
    dispatch({ type: types.UPDATE_TITLE, payload: title });
  };
  const updateSynopsis = (e) => {
    let title = e.target.value;
    dispatch({ type: types.UPDATE_SYNOPSIS, payload: title });
  };
  return (
    <>
      <div className="main edit-main">
        <div className="feeds">
          <div className="feed">
            <input
              title="Title"
              type="text"
              name="title"
              className="textfield title-field"
              placeholder={`Title${state.error ? "*" : ""}`}
              value={state.book.title}
              style={{ width: "100%" }}
              onChange={updateTitle}
            />

            {isMobile ? (
              <MobileEditor />
            ) : (
              <Editor
                editorState={editorState}
                placeholder={`Write your story...${state.error ? "*" : ""}`}
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
                <b>{genres[Number(state.book.genre)]}</b>
              </p>
              {state.book.tags.map((k, index) => (
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
              value={state.book.synopsis}
              onChange={updateSynopsis}
              style={{ width: "100%", resize: "none" }}
            />
          </div>
        </div>
        <Sidebar />
      </div>
      <div ref={previewRef}></div>
      {state.preview && (
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
              dispatch({ type: types.SET_PREVIEW, payload: false });
            }}>
            <FeatherIcon icon="eye-off" />
          </div>
        </>
      )}
    </>
  );
};
const MobileEditor = () => {
  const { state, dispatch } = usePreview();

  const handleChange = (e) => {
    let body = e.target.value;
    useCallback(() => {
      dispatch({ type: types.SET_MOBILE_BODY, payload: body });
    }, [body]);
  };
  return (
    <div className="textfield mobile-body" style={{ marginRight: 0 }}>
      <span
        className="mobile-body-span"
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={createMarkup(state.book.body)}></span>
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
        value={state.mobileBody}
        onChange={handleChange}
        placeholder="Continue your story..."
        className="textfield"
        style={{ width: "100%", resize: "none" }}
      />
    </div>
  );
};

const Preview = () => {
  const { state } = usePreview();

  return (
    <div className="preview-main">
      <div className="preview">
        <h1>{state.book.title}</h1>
        <hr />
        <p
          dangerouslySetInnerHTML={createMarkup(
            state.book.body + state.mobileBody
          )}
          style={{ textAlign: "justify" }}
          className="preview-body"></p>
      </div>
    </div>
  );
};
const Sidebar = () => {
  const [tab, setTab] = useState(0);
  const { state } = usePreview();
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
            {state.messages.length - state.read !== 0 && index === 1 && (
              <p className="badge">
                {Number(state.messages.length) - Number(state.read)}
              </p>
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
  const { state } = usePreview();
  const { user } = useAuth();
  return (
    <div className="sidebarContent">
      <Accordion component={<Members />} title="Team Members" isOpen={true} />
      {state.book.leader === user.uid && (
        <Accordion
          component={<Requests />}
          title="Join Requests"
          notification={state.book.requests.length}
        />
      )}
      <Accordion
        component={<Prs />}
        title="Submit Requests"
        notification={state.book.prs}
      />
    </div>
  );
};
const Mobile = () => {
  const [tab, setTab] = useState(0);
  const { state } = usePreview();
  const tabs = [
    { icon: "book", title: "Edit" },
    { icon: "users", title: "Team" },
    { icon: "message-circle", title: "Message" },
  ];
  const activeClass = (index) => {
    return tab === index ? " tab-active" : "";
  };
  const comps = [<TextEditor />, <SidebarContent />, <Message />];
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
            {state.messages.length - state.read !== 0 && index === 2 && (
              <p className="badge">
                {Number(state.messages.length) - Number(state.read)}
              </p>
            )}
          </button>
        ))}
      </div>
      <div className="create-mob-main">{comps[tab]}</div>
    </div>
  );
};
export default Edit;
