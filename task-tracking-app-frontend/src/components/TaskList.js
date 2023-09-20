import React, { useState, useEffect } from 'react';
import { request, getAuthToken } from '../axios_helper';
import jwt_decode from 'jwt-decode';

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
        setTasks(response.data);
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

  return (
    <div>
      <h2>Task List</h2>
      <button onClick={handleRefresh}>Refresh</button>
      {loading && <p>Loading...</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>Name:</strong> {task.name}<br />
            <strong>Description:</strong> {task.description}
          </li>
        ))}
      </ul>
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
