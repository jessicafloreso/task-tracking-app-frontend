import React, { useState } from 'react';
import { request, getAuthToken } from '../axios_helper'; // Import getAuthToken from axios_helper
import jwt_decode from 'jwt-decode';
import '../TaskForm.css';
export default function TaskForm(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const token = getAuthToken(); // Use getAuthToken to retrieve the token

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    // Check if name or description is empty
    if (!name.trim() || !description.trim()) {
      // Show the alert
      setShowAlert(true);
      return; // Don't proceed with task creation
    }

    const username = getUserNameFromToken(token); // Implement getUserIdFromToken function

    // Create a new task
    const newTask = {
      name,
      description,
      isCompleted: false,
      username,
    };


    request('POST', '/task', newTask)
      .then((response) => {
        setName(''); // Clear input fields after creating task
        setDescription('');
        props.onTaskCreated();
        setShowAlert(false);
        setShowSuccess(true);
        props.onTaskCreated(newTask);
        // Hide the success message after 5 seconds (5000 milliseconds)
        setTimeout(function () {
          setShowSuccess(false);
        }, 5000);
      })
      .catch((error) => {
        console.error('Error creating task', error);

      });
  };

  return (
    <div className="task-form-container"> {/* Apply the container class */}
      <h2>Create a New Task</h2>
      <form className="task-form" onSubmit={handleTaskSubmit}> {/* Apply the form class */}
        <div className="form-group"> {/* Apply the form group class */}
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group"> {/* Apply the form group class */}
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            className="form-control" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">Create Task</button> {/* Apply the button class */}
      </form>
      <div id="success-message" className={showSuccess ? 'alert success' : 'alert hidden'}>
        Task created successfully! Press refresh to see the task!
      </div>
      {showAlert && (
        <div className="alert">
          Please provide both a name and a description for the task.
        </div>
      )}
    </div>
  );
}

function getUserNameFromToken(token) {
  try {
    const decodedToken = jwt_decode(token);
    // Log the decoded token and the extracted username
    console.log('Decoded Token:', decodedToken);
    const username = decodedToken.sub; 

    console.log('Extracted Username:', username);
    return username;
  } catch (error) {
    console.error('Error decoding token', error);
    return null; 
  }
}

