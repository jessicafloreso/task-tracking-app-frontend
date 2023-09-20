import React, { useState } from 'react';
import { request, getAuthToken } from '../axios_helper'; // Import getAuthToken from axios_helper
import jwt_decode from 'jwt-decode';

export default function TaskForm(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const token = getAuthToken(); // Use getAuthToken to retrieve the token

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const username = getUserNameFromToken(token); // Implement getUserIdFromToken function

    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Username:', username);

    // Create a new task
    const newTask = {
      name,
      description,
      isCompleted: false,
      username,
    };

    props.onTaskCreated(newTask); // <-- Notify the parent component about the new task

    request('POST', '/task', newTask)
      .then((response) => {
        // Handle success
        console.log('Task created successfully');
        setName(''); // Clear input fields after creating task
        setDescription('');
        props.onTaskCreated();

        // Optionally, you can update the task list in the parent component here
      })
      .catch((error) => {
        // Handle error
        console.error('Error creating task', error);
        

      });
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <form onSubmit={handleTaskSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
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
    return null; // Handle error case gracefully
  }
}

