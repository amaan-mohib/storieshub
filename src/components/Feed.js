import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";

const Feed = (props) => {
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (props.data.likes) {
      setLikes(props.data.likes.length);
      if (props.data.likes.includes(user.uid)) setLike(true);
    }
    const ls2 = localStorage.getItem("adult");
    if (ls2 === "true") setAllowed(true);
  }, []);
  const likeAdd = () => {
    setLikes(likes + 1);
    db.collection("published")
      .doc(props.data.id)
      .set(
        {
          likes: timestamp.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
  };
  const likeRemove = () => {
    setLikes(likes - 1);
    db.collection("published")
      .doc(props.data.id)
      .set(
        {
          likes: timestamp.arrayRemove(user.uid),
        },
        { merge: true }
      )
      .catch((err) => console.error(err));
  };
  return (
    <div className="feed">
      {props.data.nsfw && !allowed && (
        <div className="cover">
          <FeatherIcon icon="eye-off" />
          <p>This story contains strong language</p>
          <button
            style={{ marginTop: "15px" }}
            onClick={() => setAllowed(true)}
            className="button secondary-but but-outline">
            Continue
          </button>
        </div>
      )}
      <div className="feed-title">
        <div>
          <Link className="feed-title-heading" to={`/book/${props.data.id}`}>
            <h2>{props.data.title}</h2>
          </Link>
          <p>
            {props.data.authors &&
              props.data.authors.map((a, index) => {
                return (
                  <>
                    <Link
                      className="feed-author"
                      to={`/${a.id}`}>{`${a.displayName}`}</Link>
                    {index < props.data.authors.length - 1 ? ", " : ""}
                  </>
                );
              })}
          </p>
        </div>
        {user && (
          <div className="likes">
            <div
              className="icon-button"
              onClick={() => {
                setLike(!like);
                like ? likeRemove() : likeAdd();
              }}
              style={{ marginRight: "5px" }}>
              <FeatherIcon icon="heart" fill={like ? "red" : "none"} />
            </div>
            <p>{0 || likes}</p>
          </div>
        )}
      </div>
      <hr />
      <div className="feed-body">{props.data.synopsis}</div>
      <div className="keywords">
        {props.data.tags.map((k) => (
          <p key={k}>{k}</p>
        ))}
      </div>
      <div className="published">
        {props.data.updatedAt.toDate().toLocaleDateString()}
        <div style={{ display: "flex", alignItems: "center" }}>
          {props.data.nsfw && <div style={{ fontWeight: "bold" }}>18+</div>}
          <div className="icon-button icon-button-sm">
            <FeatherIcon icon="flag" size="15" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
