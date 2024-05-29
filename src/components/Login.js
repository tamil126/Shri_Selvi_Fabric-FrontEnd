import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../config/constant';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!username || !password) {
            setErrorMessage("Please enter both username and password.");
            return;
        }

        axios.post(`${BASE_URL}/login`, { username, password })  // Full URL of the backend
            .then((res) => {
                if (res.data.status === "success") {
                    alert("Successfully logged in!");
                    window.location.href = `/home`;
                } else if (res.data.status === "invalid_user") {
                    setErrorMessage("Invalid username or password.");
                } else if (res.data.status === "empty_set") {
                    setErrorMessage("Username not found. Please register or try a different username.");
                } else {
                    setErrorMessage("An error occurred. Please try again later.");
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                setErrorMessage("An error occurred. Please try again later");
            });
    };

    return (
        <div className='login-bg'>
            <div className="login-form">
                <h2>Login</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="forms-group">
                        <label htmlFor="username">Username</label><br />
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Email' required />
                    </div>
                    <div className="forms-group">
                        <label htmlFor="password">Password</label><br />
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Login;