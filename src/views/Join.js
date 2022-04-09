import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { NotSignedIn } from "./Home";
import short from "short-uuid";
import FeatherIcon from "feather-icons-react";
import { db, timestamp } from "../firebase";
import Navbar from "./Navbar";
import Link from "./Link";
import { genres } from "./Create";
import { LoaderIcon } from "./Edit";
import { Helmet } from "react-helmet";
import { appName } from "../config";

const Join = () => {
  const { user } = useAuth();
  return user ? <JoinBody /> : <NotSignedIn />;
};
export const JoinRequest = () => {
  const { user } = useAuth();
  return user ? <JoinRequestBody /> : <NotSignedIn />;
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
      <Helmet>
        <title>{`${appName} - Join`}</title>
      </Helmet>
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
const JoinRequestBody = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
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
  }, [id]);
  return (
    <div>
      <Helmet>
        <title>{`${appName} - Join`}</title>
      </Helmet>
      <Navbar />
      {Object.keys(data).length !== 0 && (
        <div className="main">
          {!error ? (
            <Card data={data} />
          ) : (
            <p>Please check the team ID. The ID do not exists.</p>
          )}
        </div>
      )}
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
            db.collection("requests")
              .doc(data.id)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  db.collection("requests")
                    .doc(data.id)
                    .set(
                      {
                        members: timestamp.increment(1),
                      },
                      { merge: true }
                    )
                    .catch((err) => console.error(err));
                }
              });
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
      <h2 className="feed-title-heading">{data.title}</h2>
      <p className="details">{`${data.authors.length} member${
        data.authors.length > 1 ? "s" : ""
      } • ${
        data.updatedAt && data.updatedAt.toDate().toLocaleDateString()
      }`}</p>
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
                href={`/profile/${a.id}`}
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
        {data.tags.map((k, i) => (
          <p key={i}>{k}</p>
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
          {loading && LoaderIcon}
        </button>
      ) : (
        <button
          disabled={
            (data.uids && data.uids.includes(user.uid)) ||
            (data.requestUids && data.requestUids.includes(user.uid)) ||
            req
          }
          onClick={request}
          className="button"
          style={{ justifyContent: "center" }}>
          <FeatherIcon icon="plus" />
          Request join
          {loading && LoaderIcon}
        </button>
      )}
    </div>
  );
};
export default Join;
