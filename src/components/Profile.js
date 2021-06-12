import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import Navbar from "./Navbar";
import FeatherIcon from "feather-icons-react";
import { useAuth } from "../contexts/AuthContext";
import { genres } from "./Create";

const Profile = () => {
  const { uid } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState({
    displayName: "Loading",
    email: "Loading",
    photoURL: "Loading",
  });
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [published, setPublished] = useState([]);
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
          console.log(doc.data());
          if (doc.data().books) {
            setBooks(doc.data().books);
          }
          if (doc.data().published) {
            console.log("in future");
            setPublished(doc.data().published);
          }
          if (!user || user.uid !== uid) setActiveTab(1);
        } else {
          setError(true);
        }
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
                    ? ` • ${books.length} draft${
                        books.length > 1 ? "s" : ""
                      } (private)`
                    : ""
                }`}</p>
              </div>
              <hr />
              {user && user.uid === uid && (
                <div style={{ display: "flex", margin: "10px 0" }}>
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
              {activeTab === 0 ? <Books uid={uid} /> : <Published uid={uid} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const Books = ({ uid }) => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    db.collection("books")
      .where("uids", "array-contains", uid)
      .get()
      .then((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => doc.data());
        setBooks(
          docs.sort((a, b) => b.updatedAt.toDate() - a.updatedAt.toDate())
        );
      })
      .catch((err) => console.error(err));
  }, [uid]);
  return (
    <div style={{ marginTop: "5px" }}>
      {books.length > 0 ? (
        books.map((b) => (
          <div className="feed" key={b.title}>
            <div className="feed-title">
              <div>
                <Link className="feed-title-heading" to={`/edit/${b.id}`}>
                  <h2>{b.title}</h2>
                </Link>
                <p style={{ display: "inline-flex" }}>
                  {b.authors.map((a, index) => {
                    return (
                      <Link
                        key={index}
                        className="feed-author comma"
                        style={
                          a.leader
                            ? { fontWeight: "bold" }
                            : { fontWeight: "normal" }
                        }
                        to={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
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
const Published = ({ uid }) => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    db.collection("published")
      .where("uids", "array-contains", uid)
      .get()
      .then((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => doc.data());
        setBooks(
          docs.sort((a, b) => b.updatedAt.toDate() - a.updatedAt.toDate())
        );
      })
      .catch((err) => console.error(err));
  }, [uid]);
  return (
    <div style={{ marginTop: "5px" }}>
      {books.length > 0 ? (
        books.map((b) => (
          <div className="feed" key={b.title}>
            <div className="feed-title">
              <div>
                <Link className="feed-title-heading" to={`/book/${b.id}`}>
                  <h2>{b.title}</h2>
                </Link>
                <p>
                  {b.authors.map((a, index) => {
                    return (
                      <>
                        <Link
                          className="feed-author"
                          style={a.leader && { fontWeight: "bold" }}
                          to={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                        {index < b.authors.length - 1 ? ", " : ""}
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
              {b.tags.map((k) => (
                <p>{k}</p>
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
