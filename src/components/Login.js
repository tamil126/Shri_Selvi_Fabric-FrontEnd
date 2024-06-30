import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../authContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, handleLogin } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    handleLogin(username, password).then(() => {
      if (isLoggedIn) {
        navigate('/home', { replace: true });
      }
    });
  };

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className='login-bg'>
      <div className="login-form">
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <form onSubmit={handleSubmit} >
          <div className="forms-group">
            <label htmlFor="username">Username</label><br />
            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' required autoComplete="off" />
          </div>
          <div className="forms-group">
            <label htmlFor="password">Password</label><br />
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' required autoComplete='off' />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
