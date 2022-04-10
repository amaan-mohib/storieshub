import React from "react";
import { useRouter } from "next/router";
import { usePreview } from "../contexts/PreviewContext";
import { db, timestamp } from "../firebase";

const Requests = () => {
  const { requests, setOtherData, setRequests } = usePreview();
  const router = useRouter();
  const { id } = router.query;
  const approve = (author, uid) => {
    let docRef = db.collection("books").doc(id);
    docRef
      .set(
        {
          authors: timestamp.arrayUnion({
            displayName: author.displayName,
            id: author.id,
            photoURL: author.photoURL,
            leader: false,
          }),
          uids: timestamp.arrayUnion(uid),
          requests: timestamp.arrayRemove({
            displayName: author.displayName,
            id: author.id,
            photoURL: author.photoURL,
            leader: false,
          }),
          requestUids: timestamp.arrayRemove(uid),
        },
        { merge: true }
      )
      .then(() => {
        db.collection("requests")
          .doc(id)
          .get()
          .then((doc) => {
            if (doc.exists) {
              db.collection("requests")
                .doc(id)
                .set(
                  {
                    members: timestamp.increment(1),
                  },
                  { merge: true }
                )
                .catch((err) => console.error(err));
            }
            db.collection("users")
              .doc(`${uid}`)
              .set(
                {
                  books: timestamp.arrayUnion(uid),
                },
                { merge: true }
              );
          })
          .then(() => {
            setOtherData((d) => [...d, author]);
            setRequests((d) => d.filter((data) => data.id !== uid));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const deny = (author, uid) => {
    let docRef = db.collection("books").doc(id);
    docRef
      .set(
        {
          requests: timestamp.arrayRemove(author),
          requestUids: timestamp.arrayRemove(uid),
        },
        { merge: true }
      )
      .then(() => {
        setRequests((d) => d.filter((data) => data.id !== uid));
      })
      .catch((err) => console.error(err));
  };
  return requests.length > 0 ? (
    <div>
      <ul className="team-members">
        {requests.map((data, index) => (
          <li className="team-member request" key={data.id}>
            <div className="team-member-div">
              <img
                referrerPolicy="no-referrer"
                src={
                  data.photoURL ||
                  "https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
                }
                alt="profile"
                className="pfp nav-img"
              />
              <Link
                href={`/profile/${data.id}`}
                className="feed-author">{`${data.displayName}`}</Link>
            </div>
            <div>
              <p className="link" onClick={() => approve(data, data.id)}>
                Approve
              </p>
              <p className="link" onClick={() => deny(data, data.id)}>
                Deny
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>No Join Requests</p>
  );
};

export default Requests;
