import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Feed from "./Feed";
import { SmallLogin } from "./Login";
import Navbar from "./Navbar";
import FeatherIcon from "feather-icons-react";

const Home = () => {
  const { user } = useAuth();
  return user ? <Feeds /> : <NotSignedIn />;
};

export const Feeds = () => {
  const { user } = useAuth();
  const [sort, setSort] = useState(0);
  const feed = [
    {
      id: "abc",
      title: "Lorem Ipsum",
      synopsis:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit",
      authors: [
        { id: "luke", name: "Luke" },
        { id: "anakin", name: "Anakin" },
        { id: "kenobi", name: "Obi-Wan Kenobi" },
        { id: "maul", name: "Darth Maul" },
      ],
      likes: 999,
      keywords: ["def", "ijk", "lmno"],
      publishedAt: "6th June, 2021",
    },
    {
      id: "def",
      title: "Lorem Ipsum",
      synopsis:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit",
      authors: [
        { id: "luke", name: "Luke" },
        { id: "anakin", name: "Anakin" },
        { id: "kenobi", name: "Obi-Wan Kenobi" },
        { id: "maul", name: "Darth Maul" },
        { id: "maul", name: "Darth Maul" },
      ],
      likes: 6,
      keywords: ["def", "ijk", "lmno"],
      publishedAt: "6th June, 2021",
    },
    {
      id: "def",
      title: "Lorem Ipsum",
      synopsis:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit",
      authors: [
        { id: "luke", name: "Luke" },
        { id: "anakin", name: "Anakin" },
        { id: "kenobi", name: "Obi-Wan Kenobi" },
        { id: "maul", name: "Darth Maul" },
      ],
      likes: 6,
      keywords: ["def", "ijk", "lmno"],
      publishedAt: "6th June, 2021",
    },
  ];
  const activeClass = (index) => {
    return sort === index ? " tab-active" : "";
  };
  const sortFilters = [
    { name: "Top", icon: "chevrons-up" },
    { name: "New", icon: "star" },
  ];
  return (
    <div>
      <Navbar />
      <div className="main">
        <div className="feeds">
          {user && (
            <div className="feed top-buts">
              <Link to="/create" className="button">
                <FeatherIcon icon="plus" />
                <p>Create</p>
              </Link>
              <Link to="/teams" className="button">
                <FeatherIcon icon="users" />
                <p>Join</p>
              </Link>
            </div>
          )}
          <div style={{ display: "flex", margin: "10px 0" }}>
            {sortFilters.map((filter, index) => (
              <button
                className={`dropdown-item tab-icon${activeClass(index)}`}
                onClick={() => setSort(index)}>
                <FeatherIcon
                  icon={filter.icon}
                  className={`${
                    activeClass(index) === " tab-active"
                      ? "tab-active-icon"
                      : ""
                  }`}
                />
                <p style={{ marginLeft: "10px" }}>{filter.name}</p>
              </button>
            ))}
          </div>
          {feed.map((data) => (
            <Feed data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export function NotSignedIn() {
  return (
    <div className="home">
      <div className="landing">
        <div>
          <h1 style={{ fontSize: "3rem" }}>StoriesHub</h1>
          <p className="comp">
            Create and share stories with a team or individually.
          </p>
          <p style={{ marginTop: "10px" }}>
            <Link to="/browse">Browse &gt;</Link>
          </p>
        </div>
        <div>
          <SmallLogin />
        </div>
      </div>
    </div>
  );
}

export default Home;
