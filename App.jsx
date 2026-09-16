import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
const [showRegister, setShowRegister] = useState(false);
  const token = localStorage.getItem("token");
 if (!isLoggedIn) {
  if (showRegister) {
    return (
      <Register onRegister={() => setShowRegister(false)} />
    );
  }

  return (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onRegister={() => setShowRegister(true)}
    />
  );
}
  const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.tasks);
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          description,
          status,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task created successfully!");

      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");

      fetchTasks();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to create task"
      );
    }
  };

const deleteTask = async (taskId) => {
  try {
    await axios.delete(
      `http://localhost:5000/api/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Task deleted successfully!");

    fetchTasks();
  } catch (error) {
    alert(
      error.response?.data?.message || "Failed to delete task"
    );
  }
};
const updateTask = async (taskId) => {
  const newStatus = prompt(
    "Enter status: pending, in-progress, or completed"
  );

  if (!newStatus) return;

  try {
    await axios.put(
      `http://localhost:5000/api/tasks/${taskId}`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Task updated successfully!");

    fetchTasks();
  } catch (error) {
    alert(
      error.response?.data?.message || "Failed to update task"
    );
  }
};
  return (
    <div className="container">
    <div className="header">
    <h1>Task Manager Dashboard</h1>
    <button onClick={logout}>Logout</button>
  </div>

  <h2>Create New Task</h2>

      <form onSubmit={createTask} className="form-box">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        <br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <br />
        <br />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      <h2>My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task">
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
              <strong>Status:</strong> {task.status}
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
            <button onClick={() => deleteTask(task._id)}>
  Delete
</button>
<button onClick={() => updateTask(task._id)}>
  Update Status
</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default App;