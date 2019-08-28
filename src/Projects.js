import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { FirebaseContext } from "./firebase/firebase";
import { useScreenReader } from "./hooks/screenReader";
import { UserContext } from "./firebase/FirebaseUser";
import Alert from "@reach/alert";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [signOutSuccess, setSignOutSuccess] = useState(false);
  const [msg, setScreenReaderMsg] = useScreenReader();

  const [projectName, setProjectName] = useState("");
  const firebase = useContext(FirebaseContext);
  const user = useContext(UserContext);
  const { uid, displayName } = user;
  const removeProject = async p => {
    const { id, projectName } = p;
    try {
      await firebase.db
        .collection("projects")
        .doc(id)
        .delete();
      setProjects(p => {
        return p.filter(value => value.id !== id);
      });
      setScreenReaderMsg(`Project ${projectName} was removed successfully.`);
    } catch (e) {
      console.table(e);
    }
  };
  const handleSubmit = async e => {
    const data = {
      projectName,
      date: firebase.timeStamp.now(),
      uid
    };
    try {
      const response = await firebase.db.collection("projects").add(data);
      setProjects(p => {
        return [...p, { id: response.id, ...data }];
      });
      setScreenReaderMsg(`Project ${data.projectName} added successfully.`);
    } catch (e) {
      console.table(e);
    }
  };
  const projectList = projects
    ? projects.map((p, i) => {
        const { id, projectName } = p;
        return (
          <li key={id}>
            <button
              onClick={e => {
                e.preventDefault();
                removeProject(p);
              }}
            >
              Remove
            </button>
            <br />
            <Link to={`/project/${id}`}>{projectName}</Link>
          </li>
        );
      })
    : "";
  useEffect(() => {
    async function fetchData() {
      if (!uid) return {};
      const data = await firebase.db
        .collection("projects")
        .where("uid", "==", uid)
        .get();
      let docs = [];
      data.forEach(doc => {
        docs = [...docs, { id: doc.id, ...doc.data() }];
      });

      setProjects(docs);
    }

    fetchData();
  }, [firebase.db, uid]);
  return (
    <div>
      {signOutSuccess && <Redirect to="/" />}
      <h1>projects for {displayName}</h1>
      <button
        onClick={e => {
          firebase.signOut();
          setSignOutSuccess(true);
        }}
      >
        Sign Out
      </button>
      <ul>{projectList}</ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <label htmlFor="projectName">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={e => {
            setProjectName(e.target.value);
          }}
          id="projectName"
        />
        <button type="submit">Submit</button>
      </form>
      <Alert>{msg}</Alert>
    </div>
  );
};
export default Projects;
