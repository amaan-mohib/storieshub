import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FeatherIcon from "feather-icons-react";
import ToggleButton from "react-toggle-button";

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
  return (
    <div>
      <Navbar />
      <div className="main">
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
                  <b>18+</b>
                </span>
                <div className="dropdown-text">
                  <p className="dropdown-primary">Adult Content</p>
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
