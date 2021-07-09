import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { usePreview } from "../contexts/PreviewContext";
import ToggleButton from "react-toggle-button";
import { genres } from "./Create";
import { LoaderIcon } from "./Edit";
import { db, timestamp } from "../firebase";
import { ReactComponent as SVG } from "./undraw_Done_re_oak4.svg";

const PublishForm = ({ close1 = <div></div>, close2 = <div></div>, data }) => {
  const { id } = useParams();
  const [complete, setComp] = useState(false);
  const { title, synopsis, genre, tags, nsfw, body, mobileBody, otherData } =
    usePreview();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [next, setNext] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingMsg, setDeletingMsg] = useState("draft");
  const history = useHistory();
  const validation = () => {
    if (
      title.trim() === "" ||
      `${body.trim()}+${mobileBody.trim()}` === "" ||
      synopsis.trim() === "" ||
      genre === ""
    ) {
      setError(true);
      return true;
    } else {
      setError(false);
      return false;
    }
  };
  const deleteDraft = () => {
    setDeleting(true);
    let docRef = db.collection("books").doc(id);
    let msgRef = db.collection("messages").doc(id);
    let reqRef = db.collection("requests").doc(id);
    docRef
      .delete()
      .then(() => {
        setDeletingMsg("messages");
        msgRef
          .delete()
          .then(() => {
            setDeletingMsg("requests");
            reqRef
              .delete()
              .then(() => {
                setDeletingMsg("done");
                setDeleting(false);
                history.replace("/");
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const publish = () => {
    setLoading(true);
    let docRef = db.collection("published").doc(id);
    docRef
      .set(
        {
          id: docRef.id,
          title: title,
          body: `${body.trim()}<p>${mobileBody.trim()}</p>`,
          synopsis: synopsis,
          genre: genre,
          tags: tags,
          nsfw: nsfw,
          authors: otherData,
          likes: [],
          uids: data.uids,
          leader: data.leader,
          complete: complete,
          updatedAt: timestamp.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        setLoading(false);
        setNext(true);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="dialog">
      <div className="dialog-title">
        <h1>Publish</h1>
        {close1}
      </div>
      <hr />
      <div className="publish dialog-body">
        {next ? (
          deleting ? (
            <h3 className="p-dialog">{`Deleting ${deletingMsg}...`}</h3>
          ) : (
            <div style={{ textAlign: "center" }}>
              <SVG className="svg" />
              <h3 className="p-dialog">Your story has been published!</h3>
              {complete ? (
                <p
                  style={{
                    fontSize: "x-small",
                    display: "flex",
                    marginTop: "10px",
                  }}>
                  Do you want to{" "}
                  <span className="link-sm" onClick={deleteDraft}>
                    delete
                  </span>{" "}
                  this draft? (Including messages and requests)
                </p>
              ) : (
                <p style={{ fontSize: "small" }}>
                  Since, your story is not complete, you can continue working on
                  the draft.
                </p>
              )}
            </div>
          )
        ) : (
          <PublishBody
            error={error}
            story={
              <div className="toggleDiv" onClick={() => setComp(!complete)}>
                <p style={{ fontSize: "small" }}>Story Complete</p>
                <ToggleButton
                  value={complete}
                  onToggle={() => setComp(!complete)}
                />
              </div>
            }
          />
        )}
      </div>
      <hr />
      <div className="dialog-actions">
        <div>
          {!next ? (
            <button
              className="button"
              onClick={() => {
                if (!validation()) {
                  publish();
                }
              }}>
              Publish
              {loading && LoaderIcon}
            </button>
          ) : null}
          {close2}
        </div>
      </div>
    </div>
  );
};
const PublishBody = ({ story, error }) => {
  const {
    title,
    setTitle,
    synopsis,
    setSynopsis,
    nsfw,
    setNsfw,
    genre,
    setGenre,
    tags,
  } = usePreview();

  return (
    <div className="feed">
      <input
        type="text"
        title="Title"
        name="title"
        className="textfield title-field"
        placeholder={`Title${error ? "*" : ""}`}
        value={title}
        style={{ width: "100%" }}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        autoCapitalize="words"
      />
      <div className="keywords">
        <p>
          <b>{genres[Number(genre)]}</b>
        </p>
        {tags.map((k) => (
          <p key={k}>{k}</p>
        ))}
      </div>
      <textarea
        name="synopsis"
        type="text"
        title="Synopsis"
        placeholder={`Synopsis${error ? "*" : ""}`}
        rows="5"
        className="textfield"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        style={{ width: "100%", resize: "none" }}
      />
      <div>
        <select
          id="genres"
          value={genre}
          title="Genre"
          onChange={(e) => setGenre(e.target.value)}>
          <option value="" selected style={{ color: "var(--secondary-text)" }}>
            {`Select Genre${error ? "*" : ""}`}
          </option>
          {genres.map((g, i) => (
            <option value={i}>{g}</option>
          ))}
        </select>
      </div>
      <div className="toggleDiv" onClick={() => setNsfw(!nsfw)}>
        <p style={{ fontSize: "small" }}>Matured Content</p>
        <ToggleButton value={nsfw} onToggle={() => setNsfw(!nsfw)} />
      </div>
      {story}
    </div>
  );
};
export default PublishForm;
