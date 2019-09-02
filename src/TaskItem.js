import React from "react";
import { useConfirm } from "./hooks/useConfirm";
import Timer from "./Timer";
const TaskItem = props => {
  const {
    id,
    name,
    desc,
    status,
    lastHistoryID,
    statusChange,
    deleteTask
  } = props;
  function friendlyStatus(status) {
    switch (status) {
      case "Start": {
        return "In Progress";
      }
      case "Stop": {
        return "Stopped";
      }
      default: {
        return status;
      }
    }
  }
  const [open, ModalComponent] = useConfirm(
    `Are you sure you want to delete ${name}?`,
    () => {
      deleteTask(id);
    }
  );
  return (
    <>
      <tr>
        <td>
          <button
            onClick={e => {
              e.preventDefault();
              open();
            }}
          >
            Delete
          </button>
        </td>
        <td>{name}</td>
        <td>{desc}</td>
        <td>{friendlyStatus(status)}</td>
        <Timer
          status={status}
          lastHistoryID={lastHistoryID}
          id={id}
          onStatusChange={statusChange}
        />
      </tr>
      <ModalComponent />
    </>
  );
};
export default TaskItem;
