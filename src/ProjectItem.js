import React from "react";
import { useConfirm } from "./hooks/useConfirm";
import { Link } from "react-router-dom";
const ProjectItem = ({ id, name, removeProject }) => {
  const [open, ModalComponent] = useConfirm(`delete ${name}?`, () => {
    removeProject(id);
  });
  return (
    <div>
      <Link to={`/project/${id}`}>{name}</Link>
      <br />
      <button onClick={open}>Delete</button>
      <ModalComponent></ModalComponent>
    </div>
  );
};
export default ProjectItem;
