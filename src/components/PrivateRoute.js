import React from "react";
import { Redirect, Route } from "./Link";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? <Component {...props} /> : <Redirect href="/" />;
      }}></Route>
  );
};

export default PrivateRoute;
