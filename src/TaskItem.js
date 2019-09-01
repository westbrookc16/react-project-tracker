import React from "react";
import Timer from "./Timer";
const TaskItem = props => {
  const { id, name, desc, status, lastHistoryID, statusChange } = props;
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
  return (
    <tr>
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
  );
};
export default TaskItem;
