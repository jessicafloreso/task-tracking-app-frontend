import React, { useState } from "react";
import axios from "axios";

const Login= () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the user credentials to the Springboot application for authentication
    axios.post("/authenticate", { username, password })
      .then((response) => {
        // Handle the authentication response from the Springboot application
        if (response.status === 200) {
          // Store the user's authentication token in local storage
          localStorage.setItem("token", response.data.token);

          // Update the React state to indicate that the user is authenticated
          //setUserAuthenticated(true);
        } else {
          // Handle the authentication failure
          console.error("Authentication failed");
        }
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;