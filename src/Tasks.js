import { FirebaseContext } from "./firebase/firebase";
import Alert from "@reach/alert";
import React, { useState, useContext, useEffect } from "react";
import TaskItem from "./TaskItem";

import { useScreenReader } from "./hooks/screenReader";
const Tasks = ({ id }) => {
  const initialTask = {
    name: "",
    desc: "",
    dueDate: "",
    status: "Not Started",
    lastHistoryID: null
  };
  const [task, setTask] = useState(initialTask);
  const [msg, setMsg] = useScreenReader();
  const [tasks, setTasks] = useState([]);
  const firebase = useContext(FirebaseContext);
  const statusChange = (id, status, lastHistoryID) => {
    setTasks(t => {
      return t.map(a => {
        if (a.id === id) {
          setMsg(`${a.name} was ${setVerbalStatus(status)} successfully.`);
          return { ...a, status, lastHistoryID };
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
  const deleteTask = async id => {
    await firebase.db
      .collection("tasks")
      .doc(id)
      .delete();
    setTasks(t => {
      return t.filter(value => value.id !== id);
    });
  };
  const trs = tasks.map(value => {
    return (
      <TaskItem
        {...value}
        key={value.id}
        statusChange={statusChange}
        deleteTask={deleteTask}
      />
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

    setTask(initialTask);
    setMsg(`${task.name} was added successfully.`);
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Delete</th>
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
