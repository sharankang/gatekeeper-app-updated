import React, { useState } from 'react';
import './App.css';

function App() {
  // --- STATE MANAGEMENT ---
  // useState hooks are used to store and manage the component's state.

  // 'mode' determines if we are showing the 'login' or 'signup' form.
  const [mode, setMode] = useState('login'); 
  // 'isLoggedIn' tracks if the user has successfully logged in.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 'username' and 'password' store the values from the input fields.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 'message' stores feedback from the server (e.g., "Login successful!").
  const [message, setMessage] = useState('');
  // 'messageType' will be 'success' or 'error' for styling the message.
  const [messageType, setMessageType] = useState('');

  // --- EVENT HANDLERS ---
  // These functions are called when the user interacts with the form.

  const handleFormSubmit = async (event) => {
    // Prevent the default browser action of reloading the page on form submission.
    event.preventDefault();

    // Determine the correct API endpoint based on the current mode.
    const endpoint = mode === 'login' ? '/api/login' : '/api/signup';
    const fullUrl = `http://localhost:5000${endpoint}`;

    try {
      // Use the 'fetch' API to send a POST request to our Node.js server.
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON data.
        },
        // Convert the username and password state into a JSON string.
        body: JSON.stringify({ username, password }),
      });

      // Parse the JSON response from the server.
      const data = await response.json();

      // Display the server's message.
      setMessage(data.message);

      if (data.success) {
        setMessageType('success');
        // If login was successful, update the isLoggedIn state.
        if (mode === 'login') {
          setIsLoggedIn(true);
        }
      } else {
        setMessageType('error');
      }
    } catch (error) {
      // Handle network errors (e.g., if the server is not running).
      console.error('Network error:', error);
      setMessage('Could not connect to the server. Is it running?');
      setMessageType('error');
    }
  };

  const handleLogout = () => {
    // Reset all state variables to their initial values to log the user out.
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMessage('');
    setMessageType('');
    setMode('login'); // Go back to the login screen.
  };

  // --- JSX (WHAT TO RENDER) ---
  // This is the HTML structure of our component.

  // If the user is logged in, show the welcome card.
  if (isLoggedIn) {
    return (
      <div className="App">
        <div className="welcome-card">
          <h1>Welcome, {username}!</h1>
          <p>You have successfully entered the Code Academy portal.</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  // If not logged in, show the authentication forms.
  return (
    <div className="App">
      <div className="auth-container">
        {/* Toggle buttons to switch between Login and Signup */}
        <div className="auth-toggle">
          <button
            onClick={() => setMode('login')}
            className={mode === 'login' ? 'active' : ''}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={mode === 'signup' ? 'active' : ''}
          >
            Sign Up
          </button>
        </div>

        {/* The main form */}
        <div className="form-container">
          <h2>{mode === 'login' ? 'Student Login' : 'New Student Registration'}</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>

          {/* Area to display messages from the server */}
          {message && (
            <div className={`message-area message-${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

