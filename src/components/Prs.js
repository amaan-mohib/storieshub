import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { usePreview } from "../contexts/PreviewContext";
import { db } from "../firebase";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { createMarkup } from "../utils/utils";
import Button from "./Buttons";

const Prs = () => {
  const { setPrs } = usePreview();
  const router = useRouter();
  const [prs, setThisPrs] = useState([]);
  const [copied, setCopied] = useState(false);
  const [pr, setPr] = useState({
    id: "loading",
    body: "loading",
    title: "loading",
  });
  const [open, setOpen] = useState(false);
  const { id } = router.query;
  useEffect(() => {
    let docRef = db.collection("books").doc(id).collection("prs");
    let unsub = docRef.orderBy("updatedAt", "desc").onSnapshot((query) => {
      const docs = query.docs.map((doc) => doc.data());
      setThisPrs(docs);
      setPrs(docs.length);
    });
    return () => {
      unsub && unsub();
    };
  }, [id]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(pr.body.replace(/<\/?[^>]+>/gi, ""))
        .then(() => {
          setCopied(true);
        });
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };
  return prs.length > 0 ? (
    <div>
      <ul className="prs-ul">
        {prs.map((pr) => (
          <li
            key={pr.prId}
            className="prs team-members"
            onClick={() => {
              handleOpen();
              setPr(pr);
            }}>
            <p className="pr-title">{pr.title}</p>
            <p
              style={{
                fontSize: "x-small",
                color: "var(--secondary-text)",
              }}>{`By ${pr.author.displayName} at ${
              pr.updatedAt && pr.updatedAt.toDate().toLocaleDateString()
            }`}</p>
            <p className="pr-desc">{pr.synopsis}</p>
          </li>
        ))}
        {open && (
          <div className="dialog-bg">
            <ClickAwayListener onClickAway={handleClose}>
              <div className="dialog">
                <div className="dialog-title">
                  <h1>{`${pr.title}`}</h1>
                  <div className="icon-button" onClick={() => handleClose()}>
                    <FeatherIcon icon="x" />
                  </div>
                </div>
                <hr />
                <div
                  className="dialog-body"
                  dangerouslySetInnerHTML={createMarkup(pr.body)}></div>
                <hr />
                <div className="dialog-actions">
                  <div>
                    <Button
                      outlined
                      endIcon={copied && <FeatherIcon icon="check" />}
                      onClick={copy}>
                      Copy
                    </Button>
                    <Button secondary onClick={handleClose}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </ClickAwayListener>
          </div>
        )}
      </ul>
    </div>
  ) : (
    <p>No Submit Requests</p>
  );
};

export default Prs;
