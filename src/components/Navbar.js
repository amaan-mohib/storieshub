import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FeatherIcon from "feather-icons-react";
import ClickAwayListener from "react-click-away-listener";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav>
      <Link className="heading comp" to="/">
        <h1>StoriesHub</h1>
      </Link>
      <div className="tabs">
        <TabItem icon="home" route="/" title="Home" />
        <TabItem icon="users" route="/teams" title="Teams" />
      </div>
      {user ? (
        <div className="nav-items">
          <NavItem
            icon={
              <img
                referrerPolicy="no-referrer"
                src={user.photoURL}
                alt={user.displayName}
                className="pfp nav-img"
              />
            }
            title="Account">
            <DropDown>
              <DropDownItem
                icon={
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL}
                    alt={user.displayName}
                    className="pfp"
                  />
                }
                primary={user.displayName}
                secondary="See your profile and works"
                link={`/profile/${user.uid}`}
              />
              <hr />
              <DropDownItem
                icon={<FeatherIcon icon="user-plus" />}
                primary="Change account"
                link="/login"
              />
              <DropDownItem
                icon={<FeatherIcon icon="log-out" />}
                primary="Log out"
                link="/logout"
                onClick={() => logout()}
              />
            </DropDown>
          </NavItem>
        </div>
      ) : (
        <Link to="/" className="button">
          Log in
        </Link>
      )}
    </nav>
  );
};
const NavItem = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="nav-item" onClick={() => setOpen(!open)}>
        <div className="icon-button" title={props.title}>
          {props.icon}
        </div>
        {open && props.children}
      </div>
    </ClickAwayListener>
  );
};
const DropDown = (props) => {
  return <ul className="dropdown">{props.children}</ul>;
};
const DropDownItem = (props) => {
  return (
    <li onClick={props.onClick}>
      <Link to={props.link} className="dropdown-item">
        <span className="dropdown-icon">{props.icon}</span>
        <div className="dropdown-text">
          <p className="dropdown-primary">{props.primary}</p>
          <p className="dropdown-secondary">{props.secondary}</p>
        </div>
      </Link>
    </li>
  );
};
const TabItem = (props) => {
  const activeClass = (route) => {
    return window.location.pathname === route ? " tab-active" : "";
  };
  return (
    <Link
      to={props.route}
      className={`dropdown-item tab-icon${activeClass(props.route)}`}
      title={props.title}>
      <FeatherIcon
        icon={props.icon}
        className={`${
          activeClass(props.route) === " tab-active" ? "tab-active-icon" : ""
        }`}
      />
    </Link>
  );
};
export default Navbar;
