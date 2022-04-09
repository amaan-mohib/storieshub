import React, { useEffect, useState } from "react";
import Link from "../components/Link";
import { useAuth } from "../contexts/AuthContext";
import Feed from "../components/Feed";
import { SmallLogin } from "./Login";
import Navbar from "../components/Navbar";
import FeatherIcon from "feather-icons-react";
import { db } from "../firebase";
import { LoaderIcon } from "./Edit";
import SEO from "../components/Helmet";

const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <SEO />
      {user ? <Feeds /> : <NotSignedIn />}
    </>
  );
};

export const Feeds = () => {
  const { user } = useAuth();
  const [sort, setSort] = useState(0);
  const [feed, setFeed] = useState([]);
  useEffect(() => {
    let docRef = db.collection("published");
    if (sort === 0) {
      setFeed([]);
      docRef
        .orderBy("likes", "desc")
        .get()
        .then((query) => {
          const docs = query.docs.map((doc) => doc.data());
          setFeed(docs);
        });
    }
    if (sort === 1) {
      setFeed([]);
      docRef
        .orderBy("updatedAt", "desc")
        .get()
        .then((query) => {
          const docs = query.docs.map((doc) => doc.data());
          setFeed(docs);
        });
    }
  }, [sort]);
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
              <Link href="/create" className="button">
                <FeatherIcon icon="plus" />
                <p>Create</p>
              </Link>
              <Link href="/teams" className="button">
                <FeatherIcon icon="users" />
                <p>Join</p>
              </Link>
            </div>
          )}
          <div style={{ display: "flex", margin: "10px 0" }}>
            {sortFilters.map((filter, index) => (
              <button
                className={`dropdown-item tab-icon${activeClass(index)}`}
                onClick={() => {
                  setSort(index);
                }}>
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
          {feed.length > 0 ? (
            feed.map((data) => <Feed data={data} />)
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "-5px",
              }}>
              {LoaderIcon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function NotSignedIn() {
  return (
    <div className="home">
      {/* <Helmet>
        <title>{`${appName} - Login`}</title>
      </Helmet> */}
      <div className="landing">
        <div>
          <h1 style={{ fontSize: "3rem" }}>StoriesHub</h1>
          <p className="comp">
            Create and share stories with a team or individually.
          </p>
          <p style={{ marginTop: "10px" }}>
            <Link href="/browse">
              <a className="visited">Browse &gt;</a>
            </Link>
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
