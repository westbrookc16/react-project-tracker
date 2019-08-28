import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "./firebase/firebase";
import Tasks from "./Tasks";
const Project = props => {
  const id = props.match.params.id;

  const [project, setProject] = useState({});
  const firebase = useContext(FirebaseContext);
  useEffect(() => {
    async function getProject(id) {
      const doc = await firebase.db
        .collection("projects")
        .doc(id)
        .get();
      setProject({ id: doc.id, ...doc.data() });
    }
    getProject(id);
  }, [firebase.db, id]);
  const { projectName } = project;
  return (
    <div>
      <h1>{projectName}</h1>
      <Tasks id={id} />
    </div>
  );
};
export default Project;
