import React, { useEffect, useState } from "react";
import Link from "../components/Link";
import { db, timestamp } from "../firebase";
import Navbar from "../components/Navbar";
import FeatherIcon from "feather-icons-react";
import { useAuth } from "../contexts/AuthContext";
import { genres } from "./Create";
import { useProfile } from "../contexts/ProfileContext";
import ClickAwayListener from "react-click-away-listener";
import { appName } from "../config";
import { useRouter } from "next/router";
import SEO from "../components/Helmet";
import { createMarkup, isS } from "../utils/utils";

const ProfileBody = ({ uid }) => {
  const { user } = useAuth();
  const [followed, setFollowed] = useState(false);
  const { data, error, drafts, setDrafts, published } = useProfile();
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  const activeClass = (index) => {
    return activeTab === index ? " tab-active" : "";
  };
  const tabs = [
    { name: "Draft", icon: "book-open" },
    { name: "Published", icon: "book" },
  ];
  useEffect(() => {
    if (data) {
      if (!user || (user && user.uid !== uid)) setActiveTab(1);
      if (user && data.followers && data.followers.includes(user.uid)) {
        setFollowed(true);
      }
    }

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
  }, [data, uid, user]);

  const followSate = () => {
    setFollowed(true);
    follow();
  };
  const follow = () => {
    db.collection("users")
      .doc(uid)
      .set(
        {
          followers: timestamp.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .then(() => {
        let docRef = db
          .collection("users")
          .doc(uid)
          .collection("followers")
          .doc(user.uid);
        docRef
          .set({
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          })
          .then(() => {
            db.collection("users")
              .doc(user.uid)
              .set(
                {
                  following: timestamp.arrayUnion(uid),
                },
                { merge: true }
              )
              .then(() => {
                let docRef = db
                  .collection("users")
                  .doc(user.uid)
                  .collection("following")
                  .doc(uid);
                docRef
                  .set({
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                    uid: uid,
                  })
                  .catch((err) => console.error(err));
              });
          })
          .catch((err) => console.error(err));
      });
  };
  const unfollow = () => {
    db.collection("users")
      .doc(uid)
      .set(
        {
          followers: timestamp.arrayRemove(user.uid),
        },
        { merge: true }
      )
      .then(() => {
        let docRef = db
          .collection("users")
          .doc(uid)
          .collection("followers")
          .doc(user.uid);
        docRef
          .delete()
          .then(() => {
            db.collection("users")
              .doc(user.uid)
              .set(
                {
                  following: timestamp.arrayRemove(uid),
                },
                { merge: true }
              )
              .then(() => {
                let docRef = db
                  .collection("users")
                  .doc(user.uid)
                  .collection("following")
                  .doc(uid);
                docRef.delete().catch((err) => console.error(err));
              });
          })
          .catch((err) => console.error(err));
      });
  };
  const unfollowSate = () => {
    setFollowed(false);
    unfollow();
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Navbar />
      <SEO
        title={data.displayName}
        description={`${data.displayName} has published ${
          published.length
        } stories on ${appName} with ${
          data.followers ? data.followers.length : 0
        } ${isS(data.followers, "follower")}\n Books: ${
          published.length > 0
            ? published.map((b) => `${b.title}`).join(", ")
            : "None"
        }`}
      />
      <div className="main">
        {error ? (
          <div className="home-nav">
            <h2>No user found</h2>
            <Link href="/" style={{ marginTop: "10px" }}>
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
                }}
                className="p-follow"
                onClick={() => {
                  if (user) setOpen(true);
                }}>
                {`${data.followers ? data.followers.length : 0} ${isS(
                  data.followers,
                  "follower"
                )} • ${data.following ? data.following.length : 0} following`}
              </p>
              {open && (
                <div className="dialog-bg">
                  <ClickAwayListener onClickAway={handleClose}>
                    <div>
                      <FollowDialog
                        close1={
                          <div className="icon-button" onClick={handleClose}>
                            <FeatherIcon icon="x" />
                          </div>
                        }
                        close2={
                          <button
                            className="button secondary-but"
                            onClick={handleClose}>
                            Close
                          </button>
                        }
                      />
                    </div>
                  </ClickAwayListener>
                </div>
              )}
              {user && user.uid !== uid && (
                <div>
                  <button
                    onClick={() => {
                      followed ? unfollowSate() : followSate();
                    }}
                    style={{ marginTop: "10px" }}
                    className="button secondary-but but-outline">
                    <FeatherIcon icon={followed ? "user-x" : "user-plus"} />
                    {followed ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
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
                    ? ` • ${drafts.length} ${isS(drafts, "draft")} (private)`
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
                <Link className="feed-title-heading" href={`/edit/${b.id}`}>
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
                          href={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                        {index < b.authors.length - 1 ? <p>,&nbsp;</p> : ""}
                      </>
                    );
                  })}
                </p>
              </div>
            </div>
            <hr />
            <div
              className="feed-body"
              dangerouslySetInnerHTML={createMarkup(b.synopsis)}></div>
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
                <Link className="feed-title-heading" href={`/book/${b.id}`}>
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
                            href={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                          {index < b.authors.length - 1 ? <p>,&nbsp;</p> : ""}
                        </>
                      );
                    })}
                </p>
              </div>
            </div>
            <hr />
            <div
              className="feed-body"
              dangerouslySetInnerHTML={createMarkup(b.synopsis)}></div>
            <div className="keywords">
              <p>
                <b>{genres[Number(b.genre)]}</b>
              </p>
              {b.tags.map((k, index) => (
                <p key={index}>{k}</p>
              ))}
            </div>
            <div className="published">{b.updatedAt}</div>
          </div>
        ))
      ) : (
        <p>No stories published</p>
      )}
    </div>
  );
};
const FollowDialog = ({ close1, close2 }) => {
  const { uid } = useRouter().query;
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [data, setData] = useState([]);
  const [followed, setFollowed] = useState(true);
  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        doc.data().followers &&
          doc.data().followers.includes(user.uid) &&
          setFollowed(true);
        getFollowers();
      });
  }, []);
  const getFollowers = () => {
    db.collection("users")
      .doc(uid)
      .collection("followers")
      .get()
      .then((doc) => {
        const docs = doc.docs.map((doc) => doc.data());
        setData(docs);
      });
  };
  const getFollowing = () => {
    db.collection("users")
      .doc(uid)
      .collection("following")
      .get()
      .then((doc) => {
        const docs = doc.docs.map((doc) => doc.data());
        setData(docs);
      });
  };
  const follow = () => {
    db.collection("users")
      .doc(uid)
      .set(
        {
          followers: timestamp.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .then(() => {
        let docRef = db
          .collection("users")
          .doc(uid)
          .collection("followers")
          .doc(user.uid);
        docRef
          .set({
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          })
          .then(() => {
            db.collection("users")
              .doc(user.uid)
              .set(
                {
                  following: timestamp.arrayUnion(uid),
                },
                { merge: true }
              )
              .then(() => {
                let docRef = db
                  .collection("users")
                  .doc(user.uid)
                  .collection("following")
                  .doc(uid);
                docRef
                  .set({
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                    uid: uid,
                  })
                  .catch((err) => console.error(err));
              });
          })
          .catch((err) => console.error(err));
      });
  };
  const unfollow = () => {
    db.collection("users")
      .doc(uid)
      .set(
        {
          followers: timestamp.arrayRemove(user.uid),
        },
        { merge: true }
      )
      .then(() => {
        let docRef = db
          .collection("users")
          .doc(uid)
          .collection("followers")
          .doc(user.uid);
        docRef
          .delete()
          .then(() => {
            db.collection("users")
              .doc(user.uid)
              .set(
                {
                  following: timestamp.arrayRemove(uid),
                },
                { merge: true }
              )
              .then(() => {
                let docRef = db
                  .collection("users")
                  .doc(user.uid)
                  .collection("following")
                  .doc(uid);
                docRef.delete().catch((err) => console.error(err));
              });
          })
          .catch((err) => console.error(err));
      });
  };
  const followState = () => {
    setFollowed(true);
    follow();
  };
  const unfollowState = () => {
    setFollowed(false);
    unfollow();
  };
  return (
    <div className="dialog">
      <div className="dialog-title">
        <h1>{tab === 0 ? "Followers" : "Following"}</h1>
        {close1}
      </div>
      <hr />
      <div className="dialog-body">
        <div className="follow-head">
          <p
            className={`follow-tab${tab === 0 ? " follow-tab-hover" : ""}`}
            onClick={() => {
              setTab(0);
              getFollowers();
            }}>
            Followers
          </p>
          <p
            className={`follow-tab${tab === 1 ? " follow-tab-hover" : ""}`}
            onClick={() => {
              setTab(1);
              getFollowing();
            }}>
            Following
          </p>
        </div>
        <hr />
        {data.length > 0 ? (
          <ul style={{ listStyle: "none" }}>
            {data.map((d) => (
              <li key={d.uid} className="follow-list">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>
                  <img
                    style={{
                      width: "45px",
                      height: "45px",
                      marginRight: "10px",
                    }}
                    referrerPolicy="no-referrer"
                    src={d.photoURL}
                    alt={d.displayName}
                    className="pfp"
                  />
                  {d.displayName}
                </div>
                {user.uid !== d.uid && (
                  <div
                    className="icon-button"
                    onClick={() => {
                      followed ? unfollowState() : followState();
                    }}>
                    <FeatherIcon icon={followed ? "user-x" : "user-plus"} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>
            {tab === 0
              ? "The user have 0 followers"
              : "The user does not follow anyone"}
          </p>
        )}
      </div>
      <hr />
      <div className="dialog-actions">
        <div>{close2}</div>
      </div>
    </div>
  );
};
export default ProfileBody;
