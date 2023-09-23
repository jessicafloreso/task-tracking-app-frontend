import React, { useState, useEffect } from 'react';
import { request, getAuthToken } from '../axios_helper';
import jwt_decode from 'jwt-decode';
import '../TaskList.css';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = getAuthToken();
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    const username = getUserNameFromToken(token);

    request('GET', `/task/user/${username}`)
      .then((response) => {
        // Ensure that the 'username' field is set for each task
        const tasksWithUsername = response.data.map((task) => ({
          ...task,
          username: username,
        }));

        setTasks(tasksWithUsername);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching tasks', error);
      });
  };

  const handleRefresh = () => {
    fetchTasks();
  };

  const handleTaskCompletion = (taskId, isCompleted) => {
    // Find the task to update
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      // Create an updated task object with the new completion status
      const updatedTask = {
        ...taskToUpdate,
        isCompleted: isCompleted,
      };

      // Ensure the username remains unchanged in the updatedTask
      updatedTask.username = taskToUpdate.username;

      console.log('Task to Update:', taskToUpdate);

      console.log('Payload before sending PUT request:', updatedTask);
      // Send a request to update the task's completion status on the server
      request('PUT', '/task', updatedTask)
        .then((response) => {
          // Task updated successfully on the server
          // Update the local state with the updated task
          const updatedTasks = tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          );
          setTasks(updatedTasks);
        })
        .catch((error) => {
          // Handle error gracefully
          console.error('Error updating task', error);
        });
    }
  };

  const handleTaskDeletion = (taskId) => {
    // Send a request to delete the task on the server
    request('DELETE', `/task/${taskId}`)
      .then(() => {
        // Task deleted successfully on the server
        // Remove the deleted task from the local state
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        // Handle error gracefully
        console.error('Error deleting task', error);
      });
  };

  // Filter completed and uncompleted tasks
  const completedTasks = tasks.filter((task) => task.isCompleted);
  const uncompletedTasks = tasks.filter((task) => !task.isCompleted);



return (
  <div className="task-list-container">
    <div className="header">
      <h2>Task List</h2>
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh
      </button>
    </div>
    {loading && <p>Loading...</p>}
    <div className="task-section">
      <h3>Uncompleted Tasks</h3>
      <ul className="task-list">
        {uncompletedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-details">
              <strong>Name:</strong> {task.name}  &emsp;
              <strong>Description:</strong> {task.description}
            </div>
            <div className="task-buttons">
              <button
                className="complete-button"
                onClick={() => handleTaskCompletion(task.id, true)}
              >
                Mark Completed
              </button>
              <button
                className="delete-button"
                onClick={() => handleTaskDeletion(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="task-section">
      <h3>Completed Tasks</h3>
      <ul className="task-list">
        {completedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-details">
              <strong>Name:</strong> {task.name} &emsp;
              <strong>Description:</strong> {task.description}
            </div>
            <div className="task-buttons">
              <button
                className="uncomplete-button"
                onClick={() => handleTaskCompletion(task.id, false)}
              >
                Mark Not Completed
              </button>
              <button
                className="delete-button"
                onClick={() => handleTaskDeletion(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}


function getUserNameFromToken(token) {
  try {
    const decodedToken = jwt_decode(token);

    // Log the decoded token and the extracted username
    console.log('Decoded Token:', decodedToken);

    const username = decodedToken.sub; // Assuming "sub" contains the username
    console.log('Extracted Username:', username);

    return username;
  } catch (error) {
    console.error('Error decoding token', error);
    return null; 
  }
}
