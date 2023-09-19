// TaskForm.js
import React, { useState } from 'react';
import { request } from '../axios_helper';

export default function TaskForm() {
  const [name, setName] = useState(''); // Update the state variable name
  const [description, setDescription] = useState('');


  const getCurrentUserId = () => {
    const token = localStorage.getItem('token'); // Use 'token' as the storage key

    if (token) {
      try {
        const decodedToken = jwt.decode(token); // Decode the JWT token
        return decodedToken.userId; // Extract the user ID from the token
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }

    return null;
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const userId = getCurrentUserId();

    console.log('Name:', name);
    console.log('Description:', description);
    // Create a new task
    request('POST', '/task', {
      name, // Update the variable name here
      description,
      isCompleted: false,
      userId,
    })
      .then((response) => {
        // Handle success
        console.log('Task created successfully');
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
