import React from "react";
import Navbar from "./Navbar";

const NotFound = () => {
  return (
    <div>
      <Navbar />
      <div className="home-nav main">
        <h1>404</h1>
        <p>Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
