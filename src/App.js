import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import Login from "./components/Login";
import Home from "./components/Home";
import Teams from "./components/Teams";
import Create from "./components/Create";
import PrivateRoute from "./components/PrivateRoute";
import Edit from "./components/Edit";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import EasterEgg from "./components/EasterEgg";
import Join, { JoinRequest } from "./components/Join";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/browse" component={Browse} />
          <Route path="/teams" component={Teams} />
          <Route path="/logout" component={EasterEgg} />
          <Route path="/profile/:uid" component={Profile} />
          <Route path="/join/:id/:uuid" component={Join} />
          <Route path="/join/:id" exact component={JoinRequest} />
          <PrivateRoute path="/create" component={Create} />
          <PrivateRoute path="/edit/:id" component={Edit} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
