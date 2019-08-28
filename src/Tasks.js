import { FirebaseContext } from "./firebase/firebase";
import Alert from "@reach/alert";
import React, { useState, useContext, useEffect } from "react";
import Timer from "./Timer";
import { useScreenReader } from "./hooks/screenReader";
const Tasks = ({ id }) => {
  const [task, setTask] = useState({
    name: "",
    desc: "",
    dueDate: "",
    status: "Not Started",
    lastHistoryID: null
  });
  const [msg, setMsg] = useScreenReader();
  const [tasks, setTasks] = useState([]);
  const firebase = useContext(FirebaseContext);
  const statusChange = (id, status) => {
    setTasks(t => {
      return t.map(a => {
        if (a.id === id) {
          setMsg(`${a.name} was ${setVerbalStatus(status)} successfully.`);
          return { ...a, status };
        } else {
          return a;
        }
      });
    });
  };
  const setVerbalStatus = status => {
    switch (status) {
      case "Start":
        return "Started";
      case "Stop":
        return "Stopped";
      default:
        return status;
    }
  };
  useEffect(() => {
    async function getTasks(id) {
      try {
        const res = await firebase.db
          .collection("tasks")
          .where("projectID", "==", id)
          .get();
        let docs = [];
        res.forEach(doc => {
          docs = [...docs, { id: doc.id, ...doc.data() }];
        });
        setTasks(docs);
      } catch (e) {
        console.table(e);
      }
    }

    getTasks(id);
  }, [id, firebase.db]);
  const trs = tasks.map(value => {
    const { id, name, desc, status, lastHistoryID } = value;
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
      <tr key={id}>
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
  });
  const { name, desc } = task;
  const handleChange = e => {
    const { name, value } = e.target;
    setTask(c => {
      return { ...c, [name]: value };
    });
  };
  async function addTask() {
    task.dateEntered = firebase.timeStamp.now();
    task.projectID = id;
    const res = await firebase.db.collection("tasks").add(task);
    setTasks([...tasks, { id: res.id, ...task }]);
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Desc</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{trs}</tbody>
      </table>
      <br />
      <h1>Add Task</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTask();
        }}
      >
        <p>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleChange}
          />
        </p>
        <p>
          <label htmlFor="desc">Desc</label>
          <input
            type="text"
            name="desc"
            id="desc"
            value={desc}
            onChange={handleChange}
          />
        </p>
        <button type="submit">Add</button>
      </form>
      <Alert>{msg}</Alert>
    </div>
  );
};
export default Tasks;
