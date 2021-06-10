import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { NotSignedIn } from "./Home";
import short from "short-uuid";
import FeatherIcon from "feather-icons-react";
import { db, timestamp } from "../firebase";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { genres } from "./Create";

const Join = () => {
  const { user } = useAuth();
  return user ? <JoinBody /> : <NotSignedIn />;
};
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const JoinBody = () => {
  const { id, uuid } = useParams();

  const [uid, setUid] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  useEffect(() => {
    const transalator = short();
    const joinID = transalator.toUUID(uuid);
    setUid(joinID);
    let docRef = db.collection("books").doc(id);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setData(doc.data());
          console.log(doc.data());
        } else {
          setError(true);
        }
      })
      .catch((err) => console.error(err));
  }, [id, uuid]);
  return (
    <div>
      <Navbar />
      <div className="main">
        {data.joinID === uid && !error ? (
          <Card data={data} />
        ) : (
          <p>
            Please check the join code. It may be wrong or changed by the
            leader.
          </p>
        )}
      </div>
    </div>
  );
};
const Card = ({ data }) => {
  const { user } = useAuth();
  let query = useQuery();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [req, setRequest] = useState(false);
  const join = () => {
    setLoading(true);
    let docRef = db.collection("books").doc(data.id);
    docRef
      .set(
        {
          authors: timestamp.arrayUnion({
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            leader: false,
          }),
          uids: timestamp.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .then(() => {
        db.collection("users")
          .doc(`${user.uid}`)
          .set(
            {
              books: timestamp.arrayUnion(data.id),
            },
            { merge: true }
          )
          .then(() => {
            setLoading(false);
            history.push(`/edit/${data.id}`);
            console.log("added book id to user");
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const request = () => {
    setLoading(true);
    let docRef = db.collection("books").doc(data.id);
    docRef
      .set(
        {
          requests: timestamp.arrayUnion({
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            leader: false,
          }),
          requestUids: timestamp.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .then(() => {
        setLoading(false);
        setRequest(true);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="feed team">
      <h2>{data.title}</h2>
      <p className="details">{`${data.authors.length} member${
        data.authors.length > 1 ? "s" : ""
      } • ${data.updatedAt.toDate().toLocaleDateString()}`}</p>
      <hr />
      <div className="members">
        <ul className="team-members">
          {data.authors.map((a, index) => (
            <li key={`join-${index}`} className="team-member">
              <img
                referrerPolicy="no-referrer"
                src={a.photoURL}
                alt="profile"
                className="pfp nav-img"
              />
              <Link
                className="feed-author"
                to={`/profile/${a.id}`}
                style={
                  a.leader ? { fontWeight: "bold" } : { fontWeight: "normal" }
                }>
                {a.displayName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="keywords">
        <p>
          <b>{genres[Number(data.genre)]}</b>
        </p>
        {data.tags.map((k) => (
          <p>{k}</p>
        ))}
      </div>
      <hr />
      {query.get("invite") === "true" ? (
        <button
          disabled={data.uids.includes(user.uid)}
          onClick={join}
          className="button"
          style={{ justifyContent: "center" }}>
          <FeatherIcon icon="plus" />
          Join
          {loading && (
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
      ) : (
        <button
          disabled={
            data.uids.includes(user.uid) ||
            data.requestUids.includes(user.uid) ||
            req
          }
          onClick={request}
          className="button"
          style={{ justifyContent: "center" }}>
          <FeatherIcon icon="plus" />
          Request join
          {loading && (
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
      )}
    </div>
  );
};
export default Join;
