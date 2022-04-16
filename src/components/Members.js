import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import short from "short-uuid";
import { useAuth } from "../contexts/AuthContext";
import { usePreview } from "../contexts/PreviewContext";
import { db, timestamp } from "../firebase";
import Link from "./Link";
import FeatherIcon from "feather-icons-react";
import { webUrl } from "../config";
import Button from "./Buttons";
import { types } from "../contexts/PreviewReducer";

const Members = () => {
  const { state, dispatch } = usePreview();
  const [show, setShow] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [shortId, setShortId] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateUuid = () => {
    const transalator = short();
    const uuid = transalator.generate();
    const uid = transalator.toUUID(uuid);
    setShortId(transalator.fromUUID(uid));
    dispatch({ type: types.UPDATE_JOIN_ID, payload: uid });
    let docRef = db.collection("books").doc(id);
    docRef
      .set(
        {
          joinID: uid,
        },
        { merge: true }
      )
      .then(() => {
        setShow(false);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (state.book.joinID) {
      const transalator = short();
      setShortId(transalator.fromUUID(state.book.joinID));
      setShow(false);
    }
  }, [state.book.joinID]);
  const requestMembers = () => {
    let docRef = db.collection("books").doc(id);
    let reqRef = db.collection("requests").doc(id);
    setLoading(true);
    docRef
      .set(
        {
          requested: true,
        },
        { merge: true }
      )
      .then(() => {
        reqRef
          .set({
            teamId: id,
            title: state.book.title,
            tags: state.book.tags,
            leader: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            updatedAt: timestamp.serverTimestamp(),
            members: state.book.authors.length,
            genre: state.book.genre,
          })
          .then(() => {
            dispatch({ type: types.UPDATE_REQUESTED, payload: true });
            setLoading(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const deleteRequest = () => {
    let docRef = db.collection("books").doc(id);
    let reqRef = db.collection("requests").doc(id);
    docRef
      .set(
        {
          requested: false,
        },
        { merge: true }
      )
      .then(() => {
        reqRef
          .delete()
          .then(() => {
            dispatch({ type: types.UPDATE_REQUESTED, payload: false });
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };
  const share = (url) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Invite link - StoriesHub",
          text: `Hi! You have been invited to join a team on StoriesHub by ${user.displayName}`,
          url: url,
        })
        .then(() => console.log("shared"))
        .catch((err) => console.error(err));
    }
  };
  const copy = (url) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => console.log("copied"))
        .catch((err) => console.error(err));
    }
  };
  return (
    <div>
      <ul className="team-members">
        {state.book.authors.map((a) => (
          <li className="team-member" key={a.id}>
            <img
              referrerPolicy="no-referrer"
              src={
                a.photoURL
                  ? a.photoURL
                  : "https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
              }
              alt="profile"
              className="pfp nav-img"
            />
            <Link
              href={`/profile/${a.id}`}
              className="feed-author"
              style={
                a.leader ? { fontWeight: "bold" } : { fontWeight: "normal" }
              }>
              {a.displayName}
            </Link>
            {a.leader && (
              <div
                title="Leader"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <FeatherIcon
                  icon="award"
                  size="15"
                  style={{ marginLeft: "10px" }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {state.book.leader === user.uid && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!show && (
            <p>
              <a
                className="visited"
                style={{ fontSize: "x-small", marginTop: "10px" }}
                href={`${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`}
                target="_blank"
                rel="noopener noreferrer">
                {`${webUrl}/join/${id}/${shortId}?invite=true`}
              </a>
            </p>
          )}
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
            }}>
            {show ? (
              <Button
                outlined
                startIcon={<FeatherIcon icon="link-2" />}
                onClick={generateUuid}
                style={{ marginTop: "10px" }}>
                Invite via link
              </Button>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "10px",
                  }}>
                  <Button
                    secondary
                    fullWidth
                    startIcon={
                      copied ? (
                        <FeatherIcon icon="check" />
                      ) : (
                        <FeatherIcon icon="copy" />
                      )
                    }
                    onClick={() => {
                      copy(`${shortId}`);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 1000);
                    }}>
                    Copy Code
                  </Button>
                  <Button
                    fullWidth
                    secondary
                    onClick={() => {
                      share(
                        `${process.env.PUBLIC_URL}/join/${id}/${shortId}?invite=true`
                      );
                    }}
                    startIcon={<FeatherIcon icon="share-2" />}>
                    Share
                  </Button>
                </div>
                <Button
                  outlined
                  startIcon={<FeatherIcon icon="refresh-ccw" />}
                  onClick={generateUuid}
                  style={{ marginTop: "10px" }}>
                  Generate new link
                </Button>
              </>
            )}
          </div>
          {!state.book.requested ? (
            <Button
              outlined
              onClick={requestMembers}
              startIcon={<FeatherIcon icon="user-plus" />}
              loading={loading}
              style={{ marginTop: "10px" }}>
              Request Members
            </Button>
          ) : (
            <Button
              outlined
              startIcon={<FeatherIcon icon="user-x" />}
              onClick={deleteRequest}
              style={{ marginTop: "10px" }}>
              Remove Request
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Members;
