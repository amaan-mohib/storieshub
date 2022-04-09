import React from "react";
import privateRoute from "../src/HOC/privateRoute";
import Create from "../src/views/Create";

const create = () => {
  return <Create />;
};

export default privateRoute(create);
