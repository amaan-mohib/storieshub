import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createMarkup } from "./Edit";
import FeatherIcon from "feather-icons-react";
import Navbar from "./Navbar";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";

const Book = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState({
    title: "Loading",
    body: "Loading",
    likes: [],
  });
  const [like, setLike] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let docRef = db.collection("published").doc(id);
    docRef.get().then((doc) => {
      if (doc.exists) {
        setData(doc.data());
        if (doc.data().likes.includes(user.uid)) setLike(true);
      } else setError(true);
    });
  }, []);
  const likeAdd = () => {
    db.collection("published")
      .doc(id)
      .set(
        {
          likes: timestamp.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
  };
  const likeRemove = () => {
    db.collection("published")
      .doc(id)
      .set(
        {
          likes: timestamp.arrayRemove(user.uid),
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
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
                        to={`/${a.id}`}>{`${a.displayName}`}</Link>
                      {index < data.authors.length - 1 ? ", " : ""}
                    </>
                  );
                })}
            </p>
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
              {0 || data.likes.length}
            </div>
            <hr />
            <p
              className="preview-body"
              dangerouslySetInnerHTML={createMarkup(data.body)}
              style={{ textAlign: "justify", fontSize: "large" }}></p>
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
                        like ? likeRemove() : likeAdd();
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
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: `${data.title.replace(/\w\S*/g, (w) =>
                                w.replace(/^\w/, (c) => c.toUpperCase())
                              )} - StoriesHub`,
                              text: `${
                                user.displayName
                              } shared ${data.title.replace(/\w\S*/g, (w) =>
                                w.replace(/^\w/, (c) => c.toUpperCase())
                              )} - StoriesHub`,
                              url: `/book/${id}`,
                            })
                            .then(() => console.log("shared"))
                            .catch((err) => console.error(err));
                        }
                      }}>
                      <FeatherIcon icon="share-2" />
                    </div>
                  </div>
                  <div title="Report" className="icon-button">
                    <FeatherIcon icon="flag" />
                  </div>
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