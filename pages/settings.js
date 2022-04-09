import React from "react";
import privateRoute from "../src/HOC/privateRoute";
import Settings from "../src/views/Settings";

const settings = () => {
  return <Settings />;
};

export default privateRoute(settings);
