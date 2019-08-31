import React from "react";
import { useConfirm } from "./hooks/useConfirm";
const ProjectItem = ({ id, name, removeProject }) => {
  const [open, ModalComponent] = useConfirm(`delete ${name}?`, () => {
    removeProject(id);
  });
  return (
    <div>
      {name}
      <br />
      <button onClick={open}>Delete</button>
      <ModalComponent></ModalComponent>
    </div>
  );
};
export default ProjectItem;
