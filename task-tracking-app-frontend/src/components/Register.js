import React, { useState, useEffect } from "react";
import axios from "axios";
const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await axios.post("/api/register", {
        username,
        password,
        email,
      });
      if (response.status === 200) {
        // Registration successful
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
      } else {
        // Registration failed
        alert("Registration failed");
      }
    }
};