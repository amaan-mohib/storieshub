import React, { useEffect, useState } from "react";
import Link from "../components/Link";
import { useAuth } from "../contexts/AuthContext";
import { NotSignedIn } from "./Home";
import Navbar from "../components/Navbar";
import FeatherIcon from "feather-icons-react";
import { db } from "../firebase";
import { genres } from "./Create";
import short from "short-uuid";
import SEO from "../components/Helmet";
import { useRouter } from "next/router";
import Button from "../components/Buttons";

const Teams = () => {
  const { user } = useAuth();
  return (
    <>
      <SEO title="Teams" />
      {user ? <Groups /> : <NotSignedIn />}
    </>
  );
};

const Groups = () => {
  const [data, setData] = useState([]);
  const [uuid, setUuid] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useRouter();
  useEffect(() => {
    let docRef = db.collection("requests");
    docRef
      .orderBy("updatedAt", "desc")
      .get()
      .then((querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => doc.data());
        setData(docs);
      })
      .catch((err) => console.error(err));
  }, []);
  const joinCode = () => {
    if (uuid !== "") {
      const transalator = short();
      const joinID = transalator.toUUID(uuid);
      let docRef = db.collection("books");
      setLoading(true);
      docRef
        .where("joinID", "==", joinID)
        .get()
        .then((doc) => {
          const docs = doc.docs.map((d) => d.data());
          setLoading(false);
          if (docs.length > 0) {
            let id = docs[0].id;
            history.push(`/join/${id}?invite=true`);
          } else {
            setError(true);
          }
        });
    } else {
      setError(true);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="main">
        <div className="feeds ">
          <div className="feed">
            <p>Join a team</p>
            <div className="join">
              <input
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                placeholder="Code"
                className="textfield"
                style={{ width: "inherit" }}
              />
              <Button onClick={joinCode} loading={loading}>
                Join
              </Button>
            </div>
            {error && <p className="error">Invalid code</p>}
          </div>
          <p>Available teams</p>
          <div className="teams">
            {data.map((doc) => (
              <Team key={doc.teamId} divKey={doc.teamId} data={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const Team = ({ data, divKey }) => {
  return (
    <div key={divKey} className="feed team">
      <Link className="feed-title-heading" href={`/join/${data.teamId}`}>
        <h2>{data.title}</h2>
      </Link>
      <p className="details">{`${data.members} member${
        data.members > 1 ? "s" : ""
      } ??? ${data.updatedAt.toDate().toLocaleDateString()}`}</p>
      <hr />
      <div className="members">
        <p style={{ fontSize: "small", color: "var(--secondary-text)" }}>
          Organized by
        </p>
        <ul className="team-members">
          <li className="team-member">
            <img
              referrerPolicy="no-referrer"
              src={
                data.leader.photoURL ||
                "https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
              }
              alt="profile"
              className="pfp nav-img"
            />
            <Link
              href={`/profile/${data.leader.uid}`}
              className="feed-author">{`${data.leader.displayName}`}</Link>
          </li>
        </ul>
      </div>
      <div className="keywords">
        <p>
          <b>{genres[Number(data.genre)]}</b>
        </p>
        {data.tags.map((k) => (
          <p key={k}>{k}</p>
        ))}
      </div>
      <hr />
      <Button
        as={Link}
        href={`/join/${data.teamId}`}
        startIcon={<FeatherIcon icon="plus" />}>
        Request Join
      </Button>
    </div>
  );
};
export default Teams;
