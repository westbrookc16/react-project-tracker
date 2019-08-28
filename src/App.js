import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { FirebaseUser } from "./firebase/FirebaseUser";

import "./App.css";
import { FirebaseContext, firebase } from "./firebase/firebase";
const Home = lazy(() => import("./Home"));
const Project = lazy(() => import("./Project"));
const Projects = lazy(() => import("./Projects"));
function App() {
  const LoadingMessage = () => <div>Loading...</div>;
  return (
    <FirebaseContext.Provider value={new firebase()}>
      <FirebaseUser>
        <Router>
          <Suspense fallback={<LoadingMessage />}>
            <Route path="/" exact component={Home} />
            <Route path="/projects" component={Projects} />
            <Route path="/project/:id" component={Project} />
          </Suspense>
        </Router>
      </FirebaseUser>
    </FirebaseContext.Provider>
  );
}

export default App;
