import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import Navbar from "./Navbar";
import FeatherIcon from "feather-icons-react";
import { useAuth } from "../contexts/AuthContext";
import { genres } from "./Create";
import ProfileProvider, { useProfile } from "../contexts/ProfileContext";

const Profile = () => {
  return (
    <ProfileProvider>
      <ProfileBody />
    </ProfileProvider>
  );
};
const ProfileBody = () => {
  const { uid } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState({
    displayName: "Loading",
    email: "Loading",
    photoURL:
      "https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png",
  });
  const [error, setError] = useState(false);
  const { drafts, setDrafts, published, setPublished } = useProfile();
  const [activeTab, setActiveTab] = useState(0);
  const activeClass = (index) => {
    return activeTab === index ? " tab-active" : "";
  };
  const tabs = [
    { name: "Draft", icon: "book-open" },
    { name: "Published", icon: "book" },
  ];
  useEffect(() => {
    let docRef = db.collection("users").doc(uid);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data());
          if (!user || user.uid !== uid) setActiveTab(1);
        } else {
          setError(true);
        }
      })
      .catch((err) => console.error(err));
    //Drafts
    if (user && user.uid === uid) {
      db.collection("books")
        .where("uids", "array-contains", uid)
        .get()
        .then((querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => doc.data());
          setDrafts(
            docs.sort((a, b) => b.updatedAt.toDate() - a.updatedAt.toDate())
          );
        })
        .catch((err) => console.error(err));
    }
    //Published
    db.collection("published")
      .where("uids", "array-contains", uid)
      .get()
      .then((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => doc.data());
        setPublished(
          docs.sort((a, b) => b.updatedAt.toDate() - a.updatedAt.toDate())
        );
      })
      .catch((err) => console.error(err));
  }, [uid, user]);
  return (
    <div>
      <Navbar />
      <div className="main">
        {error ? (
          <div className="home-nav">
            <h2>No user found</h2>
            <Link to="/" style={{ marginTop: "10px" }}>
              &lt; Home
            </Link>
          </div>
        ) : (
          <div className="feed">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}>
              <img
                referrerPolicy="no-referrer"
                src={data.photoURL}
                alt={data.displayName}
                className="pfp"
              />
              <h3>{data.displayName}</h3>
              <p
                style={{
                  fontSize: "small",
                  color: "var(--secondary-text)",
                }}>
                {data.email}
              </p>
              <p
                style={{
                  fontSize: "small",
                  marginTop: "10px",
                  color: "var(--secondary-text)",
                }}>
                {`${data.followers || 0} follower${
                  data.followers > 1 ? "s" : ""
                } • ${data.following || 0} following`}
              </p>
              <div>
                <button
                  style={{ marginTop: "10px" }}
                  className="button secondary-but but-outline">
                  <FeatherIcon icon="user-plus" />
                  Follow
                </button>
              </div>
            </div>
            <hr />
            <div>
              <div style={{ padding: "10px 0" }}>
                <h3>Stories by {data.displayName}</h3>
                <p
                  style={{
                    fontSize: "small",
                    color: "var(--secondary-text)",
                  }}>{`${published.length} published${
                  user && user.uid === uid
                    ? ` • ${drafts.length} draft${
                        drafts.length > 1 ? "s" : ""
                      } (private)`
                    : ""
                }`}</p>
              </div>
              <hr />
              {user && user.uid === uid && (
                <div style={{ display: "flex", margin: "15px 0" }}>
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`dropdown-item tab-icon${activeClass(index)}`}
                      onClick={() => setActiveTab(index)}>
                      <FeatherIcon
                        icon={tab.icon}
                        className={`${
                          activeClass(index) === " tab-active"
                            ? "tab-active-icon"
                            : ""
                        }`}
                      />
                      <p style={{ marginLeft: "10px" }}>{tab.name}</p>
                    </button>
                  ))}
                </div>
              )}
              {activeTab === 0 ? <Books /> : <Published />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const Books = () => {
  const { drafts } = useProfile();
  return (
    <div style={{ marginTop: "5px" }}>
      {drafts.length > 0 ? (
        drafts.map((b) => (
          <div className="feed" key={b.title}>
            <div className="feed-title">
              <div>
                <Link className="feed-title-heading" to={`/edit/${b.id}`}>
                  <h2>{b.title}</h2>
                </Link>
                <p style={{ display: "inline-flex", flexWrap: "wrap" }}>
                  {b.authors.map((a, index) => {
                    return (
                      <>
                        <Link
                          key={index}
                          className="feed-author"
                          style={
                            a.leader
                              ? { fontWeight: "bold" }
                              : { fontWeight: "normal" }
                          }
                          to={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                        {index < b.authors.length - 1 ? <p>,&nbsp;</p> : ""}
                      </>
                    );
                  })}
                </p>
              </div>
            </div>
            <hr />
            <div className="feed-body">{b.synopsis}</div>
            <div className="keywords">
              <p>
                <b>{genres[Number(b.genre)]}</b>
              </p>
              {b.tags.map((k, index) => (
                <p key={index}>{k}</p>
              ))}
            </div>
            <div className="published">
              {b.updatedAt && b.updatedAt.toDate().toDateString()}
            </div>
          </div>
        ))
      ) : (
        <p>No stories in draft</p>
      )}
    </div>
  );
};
const Published = () => {
  const { published } = useProfile();
  return (
    <div style={{ marginTop: "5px" }}>
      {published.length > 0 ? (
        published.map((b) => (
          <div className="feed" key={b.title}>
            <div className="feed-title">
              <div>
                <Link className="feed-title-heading" to={`/book/${b.id}`}>
                  <h2>{b.title}</h2>
                </Link>
                <p style={{ display: "inline-flex", flexWrap: "wrap" }}>
                  {b.authors &&
                    b.authors.map((a, index) => {
                      return (
                        <>
                          <Link
                            key={index}
                            className="feed-author"
                            style={
                              a.leader
                                ? { fontWeight: "bold" }
                                : { fontWeight: "normal" }
                            }
                            to={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                          {index < b.authors.length - 1 ? <p>,&nbsp;</p> : ""}
                        </>
                      );
                    })}
                </p>
              </div>
            </div>
            <hr />
            <div className="feed-body">{b.synopsis}</div>
            <div className="keywords">
              <p>
                <b>{genres[Number(b.genre)]}</b>
              </p>
              {b.tags.map((k, index) => (
                <p key={index}>{k}</p>
              ))}
            </div>
            <div className="published">
              {b.updatedAt.toDate().toDateString()}
            </div>
          </div>
        ))
      ) : (
        <p>No stories published</p>
      )}
    </div>
  );
};
export default Profile;
