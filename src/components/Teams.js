import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NotSignedIn } from "./Home";
import Navbar from "./Navbar";
import FeatherIcon from "feather-icons-react";

const Teams = () => {
  const { user } = useAuth();
  return user ? <Groups /> : <NotSignedIn />;
};

const Groups = () => {
  return (
    <div>
      <Navbar />
      <div className="main">
        <div className="feeds ">
          <div className="feed">
            <p>Join a team:</p>
            <div className="join">
              <input
                type="text"
                placeholder="Code"
                className="textfield"
                style={{ width: "inherit" }}
              />
              <Link className="button">Join</Link>
            </div>
          </div>
          <p>Available teams</p>
          <div className="teams">
            <Team />
            <Team />
            <Team />
          </div>
        </div>
      </div>
    </div>
  );
};
const Team = (props) => {
  return (
    <div className="feed team">
      <Link className="feed-title-heading" to={`/book`}>
        <h2>Lorem Ipsum</h2>
      </Link>
      <p className="details">3 members • 6th June, 2021</p>
      <hr />
      <div className="members">
        <ul className="team-members">
          <li className="team-member">
            <img
              referrerPolicy="no-referrer"
              src="https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
              alt="profile"
              className="pfp nav-img"
            />
            <Link className="feed-author">Luke</Link>
          </li>
          <li>
            <img
              referrerPolicy="no-referrer"
              src="https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
              alt="profile"
              className="pfp nav-img"
            />
            <Link className="feed-author">Luke</Link>
          </li>
          <li>
            <img
              referrerPolicy="no-referrer"
              src="https://www.searchpng.com/wp-content/uploads/2019/02/Men-Profile-Image-PNG.png"
              alt="profile"
              className="pfp nav-img"
            />
            <Link className="feed-author">Luke</Link>
          </li>
        </ul>
      </div>
      <div className="keywords">
        <p>abc</p>
        <p>def</p>
      </div>
      <hr />
      <Link className="button" style={{ justifyContent: "center" }}>
        <FeatherIcon icon="plus" />
        Request join
      </Link>
    </div>
  );
};
export default Teams;
