import React, { useContext } from "react";
import { FirebaseContext } from "./firebase/firebase";

const Timer = ({ id, status, onStatusChange, lastHistoryID }) => {
  const firebase = useContext(FirebaseContext);

  async function setStatus(status, lastHistoryID) {
    const clickDate = firebase.timeStamp.now();
    try {
      const historyData = await firebase.db.collection("history").add({
        taskid: id,
        status: status,
        startDate: clickDate
      });
      await firebase.db
        .collection("tasks")
        .doc(id)
        .set(
          { status, lastHistoryID: historyData.id },
          {
            merge: true
          }
        );
      if (status !== "Start") {
        //update last history with end date
        await firebase.db
          .collection("history")
          .doc(lastHistoryID)
          .set({ endDate: clickDate }, { merge: true });
      }
      onStatusChange(id, status);
    } catch (e) {
      console.table(e);
    }
  }
  return (
    <td>
      <button
        disabled={status === "Start"}
        onClick={e => {
          e.preventDefault();
          setStatus("Start", null);
        }}
      >
        Start
      </button>
      &nbsp;
      <button
        disabled={status === "Stop" || status === "Not Started"}
        onClick={e => {
          e.preventDefault();
          setStatus("Stop", lastHistoryID);
        }}
      >
        Stop
      </button>
    </td>
  );
};
export default Timer;
