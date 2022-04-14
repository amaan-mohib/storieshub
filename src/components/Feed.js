import React, { Fragment, useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import Link from "./Link";
import { useAuth } from "../contexts/AuthContext";
import { db, timestamp } from "../firebase";
import ClickAwayListener from "react-click-away-listener";
import { genres } from "../views/Create";
import { createMarkup } from "../utils/utils";
import Button from "./Buttons";

const Feed = (props) => {
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (props.data.likes) {
      setLikes(props.data.likes.length);
      if (user && props.data.likes.includes(user.uid)) setLike(true);
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
  const handleClose = () => setOpen(false);
  return (
    <div className="feed">
      {props.data.nsfw && !allowed && (
        <div className="cover">
          <FeatherIcon icon="eye-off" />
          <p>This story contains strong language</p>
          <Button
            outlined
            style={{ marginTop: "15px" }}
            onClick={() => setAllowed(true)}>
            Continue
          </Button>
        </div>
      )}
      <div className="feed-title">
        <div>
          <Link className="feed-title-heading" href={`/book/${props.data.id}`}>
            <h2>{props.data.title}</h2>
          </Link>
          <p>
            {props.data.authors &&
              props.data.authors.map((a, index) => {
                return (
                  <Fragment key={index}>
                    <Link
                      className="feed-author"
                      href={`/profile/${a.id}`}>{`${a.displayName}`}</Link>
                    {index < props.data.authors.length - 1 ? ", " : ""}
                  </Fragment>
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
      <div
        className="feed-body"
        dangerouslySetInnerHTML={createMarkup(props.data.synopsis)}></div>
      <div className="keywords">
        <p>
          <b>{genres[Number(props.data.genre)]}</b>
        </p>
        {props.data.tags.map((k) => (
          <p key={k}>{k}</p>
        ))}
      </div>
      <div className="published">
        {new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(props.data.updatedAt.toDate())}
        <div style={{ display: "flex", alignItems: "center" }}>
          {props.data.nsfw && <div style={{ fontWeight: "bold" }}>18+</div>}
          <div
            className="icon-button icon-button-sm"
            onClick={() => setOpen(true)}>
            <FeatherIcon icon="flag" size="15" />
          </div>
        </div>
      </div>
      {open && (
        <div className="dialog-bg" style={{ marginTop: "-5px", top: "50.7%" }}>
          <ClickAwayListener onClickAway={handleClose}>
            <div>
              <ReportDialog data={props.data} handleClose={handleClose} />
            </div>
          </ClickAwayListener>
        </div>
      )}
    </div>
  );
};
export const ReportDialog = ({ close1, data, handleClose }) => {
  const reports = [
    "It's spam",
    "Hate speech",
    data.nsfw ? "Demeaning stuff" : "Adult content",
    "Bullying or harrasment",
    "Intellectual property violation",
    "Other",
  ];
  const [other, setOther] = useState("");
  const [checkedReport, setReport] = useState([]);
  const [checkedState, setCheckState] = useState(
    new Array(reports.length).fill(false)
  );
  const handleOnChange = (position) => {
    let newReport = [];
    const updated = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckState(updated);

    reports.map((r, i) => {
      if (updated[i]) newReport.push(r);
      return 0;
    });
    setReport(newReport);
  };
  const report = () => {
    console.log(checkedReport);
    let list = "";
    list = checkedReport.map((t) => list + `${t}\n`);
    const body = `Your report for the story - ${data.title
      .toString()
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))} (${
      data.id
    }):\n${list.toString().replace(/,/gi, "")}\nOther: ${other}`;
    const mailto = `mailto:amaan.mohib@gmail.com?body=${encodeURIComponent(
      body
    )}&subject=Report - StoriesHub`;
    window.location.href = mailto;
  };
  return (
    <div className="dialog">
      <div className="dialog-title">
        <h1>Report</h1>
        <div className="icon-button" onClick={handleClose}>
          <FeatherIcon icon="x" />
        </div>
      </div>
      <hr />
      <div className="dialog-body">
        <p style={{ fontSize: "large", textAlign: "left" }}>
          Why are you reporting this story?
        </p>
        <ul style={{ listStyle: "none" }}>
          {reports.map((r, index) => (
            <li key={`r-${index}`} className="report-list">
              <input
                type="checkbox"
                id={`r-${index}-id`}
                name={r}
                value={r}
                checked={checkedState[index]}
                onChange={() => handleOnChange(index)}
              />
              <label htmlFor={`r-${index}-id`} style={{ marginLeft: "10px" }}>
                {r}
              </label>
            </li>
          ))}
        </ul>
        {checkedReport.includes("Other") && (
          <div style={{ textAlign: "left" }}>
            <input
              type="text"
              style={{ minWidth: "300px" }}
              className="textfield"
              placeholder="What are you trying to report?"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </div>
        )}
        <div>
          {checkedReport.length > 0 && <Button onClick={report}>Report</Button>}
        </div>
      </div>
      <hr />
      <div className="dialog-actions">
        <div>
          <Button onClick={handleClose} secondary>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Feed;
