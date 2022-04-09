import React from "react";
import privateRoute from "../../src/HOC/privateRoute";
import Edit from "../../src/views/Edit";

const edit = () => {
  return <Edit />;
};

export default privateRoute(edit);
