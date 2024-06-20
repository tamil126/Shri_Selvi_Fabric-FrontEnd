import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/constant';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('loginToken');
        if (storedToken) {
            setIsLoggedIn(true);
        }

        const handleBeforeUnload = () => {
            console.log("Tab is closing, removing token");
            localStorage.removeItem('loginToken');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!username || !password) {
            setErrorMessage("Please enter both username and password.");
            return;
        }

        axios.post(`${BASE_URL}/login`, { username, password })
            .then((res) => {
                if (res.data.status === "success") {
                    const token = res.data.token;
                    localStorage.setItem('loginToken', token);
                    setIsLoggedIn(true);
                    onLogin();
                    navigate('/transaction', { replace: true });
                    alert("Successfully logged in!");
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
                setErrorMessage("An error occurred. Please try again later.");
            });
    };

    if (isLoggedIn) {
        return <Navigate to="/transaction" replace />;
    }

    return (
        <div className='login-bg'>
            <div className="login-form">
                <h2>Login</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="forms-group">
                        <label htmlFor="username">Username</label><br />
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Email' required autoComplete="username" />
                    </div>
                    <div className="forms-group">
                        <label htmlFor="password">Password</label><br />
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required autoComplete="current-password" />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
