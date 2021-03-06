import React, { useEffect, useState } from "react";
import Link from "../components/Link";
import FeatherIcon from "feather-icons-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";
import { appName } from "../config";
import ClickAwayListener from "react-click-away-listener";
import { ReportDialog } from "../components/Feed";
import { capitalize, createMarkup } from "../utils/utils";

const Book = ({ id, data, error }) => {
  const { user } = useAuth();
  const [like, setLike] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && data && data.likes.includes(user.uid)) setLike(true);
  }, [data]);

  const handleClose = () => setOpen(false);

  const likeAdd = (add = true) => {
    db.collection("published")
      .doc(id)
      .set(
        {
          likes: add
            ? timestamp.arrayUnion(user.uid)
            : timestamp.arrayRemove(user.uid),
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
  };

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${capitalize(data.title)} - ${appName}`,
          text: `${user.displayName} shared ${capitalize(
            data.title
          )} - ${appName}`,
          url: `/book/${id}`,
        })
        .then(() => console.log("shared"))
        .catch((err) => console.error(err));
    }
  };
  return (
    <div>
      <Navbar />
      <div className="main">
        {error ? (
          <p>No book with ID {id}</p>
        ) : (
          <div className="preview">
            <h1>{data.title}</h1>
            <p style={{ marginTop: 0 }}>
              - By&nbsp;
              {data.authors &&
                data.authors.map((a, index) => {
                  return (
                    <>
                      <Link
                        className="feed-author"
                        href={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                      {index < data.authors.length - 1 ? ", " : ""}
                    </>
                  );
                })}
            </p>
            <div>
              <div
                style={{
                  fontSize: "small",
                  color: "var(--secondary-text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <FeatherIcon
                  icon="heart"
                  fill="var(--secondary-text)"
                  size="15"
                  style={{ marginRight: "5px" }}
                />
                {data.likes.length || 0}
              </div>
            </div>
            <hr />
            <p
              className="preview-body"
              dangerouslySetInnerHTML={createMarkup(data.body)}
              style={{ textAlign: "justify", fontSize: "large" }}></p>
            {!data.complete && <p>To be continued...</p>}
            <hr />
            {user && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <div
                      title="Like"
                      className="icon-button"
                      onClick={() => {
                        setLike(!like);
                        like ? likeAdd(false) : likeAdd();
                      }}>
                      <FeatherIcon
                        icon="heart"
                        style={{ cursor: "pointer" }}
                        fill={like ? "red" : "none"}
                      />
                    </div>
                    <div
                      title="Share"
                      className="icon-button"
                      onClick={() => share()}>
                      <FeatherIcon icon="share-2" />
                    </div>
                  </div>
                  <div
                    title="Report"
                    className="icon-button"
                    onClick={() => setOpen(true)}>
                    <FeatherIcon icon="flag" />
                  </div>
                  {open && (
                    <div className="dialog-bg">
                      <ClickAwayListener onClickAway={handleClose}>
                        <div>
                          <ReportDialog data={data} handleClose={handleClose} />
                        </div>
                      </ClickAwayListener>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;
