import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { usePreview } from "../../contexts/PreviewContext";
import { db, t, timestamp } from "../../firebase";
import { createMarkup } from "../../utils/utils";
import Button from "../Buttons";
import PublishForm from "../PublishForm";
import FeatherIcon from "feather-icons-react";
import { useAuth } from "../../contexts/AuthContext";
import { types } from "../../contexts/PreviewReducer";
import Background from "./style";
import { isMobile } from "react-device-detect";

const Toolbar = () => {
  const { user } = useAuth();
  const { state, dispatch } = usePreview();
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);
  const [open, setOpen] = useState(false);
  const [publishOpen, setPubOpen] = useState(false);
  const saveBook = () => {
    setLoading(true);
    let docRef = db.collection("books").doc(state.book.id);
    docRef
      .set(
        {
          title: state.book.title,
          synopsis: state.book.synopsis,
          body: `${state.book.body.trim()}${
            state.mobileBody.trim() ? `<p>${state.mobileBody.trim()}</p>` : ""
          }`,
          updatedAt: timestamp.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        dispatch({
          type: types.UPDATE_STAT,
          payload: t,
        });
        setLoading(false);
        setSave(false);
        console.log("saved");
      })
      .catch((err) => console.error(err));
  };
  const savePr = () => {
    setLoading(true);
    let docRef = db.collection("books").doc(state.book.id);
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
            title: state.book.title,
            synopsis: state.book.synopsis,
            body: `${state.book.body.trim()}${
              state.mobileBody.trim() ? `<p>${state.mobileBody.trim()}</p>` : ""
            }`,
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
  const validation = () => {
    if (
      state.book.body &&
      (state.book.title.trim() === "" ||
        state.book.body.replace(/<\/?[^>]+>/gi, "").trim() === "")
    ) {
      dispatch({ type: types.SET_ERROR, payload: true });
      return true;
    } else {
      dispatch({ type: types.SET_ERROR, payload: null });
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (state.book.leader === user.uid && !publishOpen && !validation()) {
        saveBook();
      }
    };
  }, [state.book.leader]);

  return (
    <Background>
      {open && (
        <div className="dialog-bg">
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div className="dialog">
              <div className="dialog-title">
                <h1>{`${state.book.title}`}</h1>
                <div className="icon-button" onClick={() => setOpen(false)}>
                  <FeatherIcon icon="x" />
                </div>
              </div>
              <hr />
              <div
                className="dialog-body"
                dangerouslySetInnerHTML={createMarkup(state.book.body)}></div>
              <hr />
              <div className="dialog-actions">
                <div>
                  <Button secondary onClick={() => setOpen(false)}>
                    Close
                  </Button>
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
                data={state.book}
                handleClose={() => setPubOpen(false)}
              />
            </div>
          </ClickAwayListener>
        </div>
      )}
      <div className="toolbar">
        {/* {isMobile && state.book.updatedAt && (
          <p className="stat">
            Updated: {`${state.book.updatedAt.toDate().toLocaleString()}`}
          </p>
        )} */}
        <div className="footer">
          {state.book.leader === user.uid &&
            (isMobile ? (
              <div
                className="icon-button"
                onClick={() => {
                  if (!validation()) {
                    saveBook();
                    setPubOpen(true);
                  }
                }}>
                <FeatherIcon icon="upload-cloud" />
              </div>
            ) : (
              <Button
                onClick={() => {
                  if (!validation()) {
                    saveBook();
                    setPubOpen(true);
                  }
                }}>
                Publish
              </Button>
            ))}
          {state.book.leader === user.uid ? (
            isMobile ? (
              <div
                className="icon-button"
                onClick={() => {
                  if (!validation()) {
                    saveBook();
                    setPubOpen(true);
                  }
                }}>
                <FeatherIcon icon="save" />
              </div>
            ) : (
              <Button
                loading={loading && save}
                onClick={() => {
                  if (!validation()) {
                    setSave(true);
                    saveBook();
                  }
                }}
                outlined>
                Save
              </Button>
            )
          ) : (
            <div className="footer">
              <Button
                loading={loading && save}
                onClick={() => {
                  if (!validation()) {
                    setSave(true);
                    savePr();
                  }
                }}>
                Submit
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                outlined>
                Draft
              </Button>
            </div>
          )}
          {/* <Button
            onClick={() => {
              dispatch({ type: types.SET_PREVIEW, payload: true });
              console.log(state.previewRef);
              setTimeout(() => {
                state.previewRef.scrollIntoView({ behavior: "smooth", top: 0 });
              }, 100);
            }}
            secondary>
            Preview
          </Button> */}
          <div className="icon-button">
            <FeatherIcon icon="more-vertical" />
          </div>
        </div>

        {state.error && (
          <div className="error">*Please fill the required fields</div>
        )}
      </div>
    </Background>
  );
};

export default Toolbar;
