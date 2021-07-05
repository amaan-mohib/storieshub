import React, { useEffect } from "react";
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
import Book from "./components/Book";
import Settings, { darkObj } from "./components/Settings";
import NotFound from "./components/NotFound";

function App() {
  useEffect(() => {
    const ls = localStorage.getItem("darkTheme");
    if (ls === "dark") {
      Object.keys(darkObj).map((key) => {
        const value = darkObj[key];
        document.documentElement.style.setProperty(key, value);
        return 0;
      });
    }
  }, []);
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
          <Route path="/book/:id" exact component={Book} />
          <PrivateRoute path="/settings" component={Settings} />
          <PrivateRoute path="/create" component={Create} />
          <PrivateRoute path="/edit/:id" component={Edit} />
          <Route path="*" component={NotFound} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
