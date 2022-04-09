import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FeatherIcon from "feather-icons-react";
import ToggleButton from "react-toggle-button";
import { Helmet } from "react-helmet";
import { appName } from "../config";
import ClickAwayListener from "react-click-away-listener";

export const light = {
  "--background": "hsl(43, 100%, 95%)",
  "--nav-background": "hsl(43, 100%, 97%)",
  "--nav-background-blur": "hsla(44, 100%, 97%, 0.75)",
  "--shadow": "rgba(126, 126, 126, 0.466)",
  "--text-color": "black",
  "--secondary-text": "#65676b",
  "--hr": "rgba(0, 0, 0, 0.12)",
  "--textfield": "rgb(255, 255, 255)",
  "--active": "rgba(0, 0, 0, 0.2)",
  "--hover": "rgba(0, 0, 0, 0.068)",
};
export const darkObj = {
  "--background": "hsl(0, 2%, 7%)",
  "--nav-background": "hsl(0, 2%, 10%)",
  "--nav-background-blur": "hsla(0, 2%, 10%, 0.75)",
  "--shadow": "rgba(0, 0, 0, 0.6)",
  "--text-color": "white",
  "--secondary-text": "rgba(255, 255, 255, 0.6)",
  "--hr": "rgba(230, 230, 230, 0.12)",
  "--textfield": "rgb(34, 34, 34)",
  "--active": "rgba(255, 255, 255, 0.2)",
  "--hover": "rgba(255, 255, 255, 0.068)",
};
const Settings = () => {
  const [dark, setDark] = useState(false);
  const [nsfw, setNsfw] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const ls = localStorage.getItem("darkTheme");
    const ls2 = localStorage.getItem("adult");
    if (ls === "dark") setDark(true);
    if (ls2 === "true") setNsfw(true);
  }, []);
  const applyTheme = () => {
    const theme = dark ? light : darkObj;
    Object.keys(theme).map((key) => {
      const value = theme[key];
      document.documentElement.style.setProperty(key, value);
      return 0;
    });
    localStorage.setItem("darkTheme", !dark ? "dark" : "light");
  };
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Helmet>
        <title>{`${appName} - Settings`}</title>
      </Helmet>
      <Navbar />
      <div className="main">
        {open && (
          <div
            className="dialog-bg"
            style={{ marginTop: "-5px", top: "50.7%" }}>
            <ClickAwayListener onClickAway={handleClose}>
              <div className="dialog">
                <div className="dialog-title">
                  <h1>About</h1>
                  <div onClick={handleClose} className="icon-button">
                    <FeatherIcon icon="x" />
                  </div>
                </div>
                <hr />
                <div className="dialog-body">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <img
                      src="android-chrome-192x192.png"
                      width="60px"
                      alt={appName}
                    />
                    <h1>{appName}</h1>
                    <a
                      style={{ marginTop: "20px", fontSize: "small" }}
                      className="visited"
                      rel="noreferrer"
                      target="_blank"
                      href="https://github.com/amaan-mohib/storieshub">
                      GitHub
                    </a>
                  </div>
                </div>
                <hr />
                <div className="dialog-actions">
                  <div>
                    <button
                      onClick={handleClose}
                      className="button secondary-but">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </ClickAwayListener>
          </div>
        )}
        <div className="feed">
          <ul style={{ listStyle: "none" }} className="settings">
            <li
              className="dropdown-item"
              style={{ justifyContent: "space-between" }}
              onClick={() => {
                setDark(!dark);
                applyTheme();
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <span className="dropdown-icon">
                  <FeatherIcon icon="moon" />
                </span>
                <div className="dropdown-text">
                  <p className="dropdown-primary">Dark Mode</p>
                  {/* <p className="dropdown-secondary">{props.secondary}</p> */}
                </div>
              </div>
              <ToggleButton
                value={dark}
                onToggle={() => {
                  setDark(!dark);
                  applyTheme();
                }}
              />
            </li>
            <li
              className="dropdown-item"
              style={{ justifyContent: "space-between" }}
              onClick={() => {
                setNsfw(!nsfw);
                localStorage.setItem("adult", !nsfw ? "true" : "false");
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <span className="dropdown-icon">
                  <FeatherIcon icon="shield" />
                </span>
                <div className="dropdown-text">
                  <p className="dropdown-primary">Matured Content</p>
                  <p className="dropdown-secondary">
                    View adult content in your feed
                  </p>
                </div>
              </div>
              <ToggleButton
                value={nsfw}
                onToggle={() => {
                  setNsfw(!nsfw);
                  localStorage.setItem("adult", !nsfw ? "true" : "false");
                }}
              />
            </li>
            <li>
              <a
                href="mailto:amaan.mohib@gmail.com?subject=Feedback - StoriesHub"
                className="dropdown-item"
                style={{ justifyContent: "space-between" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <span className="dropdown-icon">
                    <FeatherIcon icon="message-square" />
                  </span>
                  <div className="dropdown-text">
                    <p className="dropdown-primary">Feedback</p>
                  </div>
                </div>
              </a>
            </li>
            <li
              className="dropdown-item"
              onClick={() => setOpen(true)}
              style={{ justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <span className="dropdown-icon">
                  <FeatherIcon icon="info" />
                </span>
                <div className="dropdown-text">
                  <p className="dropdown-primary">About</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
