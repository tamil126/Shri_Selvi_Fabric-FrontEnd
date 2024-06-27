import { createContext, useState } from 'react';
import { BASE_URL } from './config/constant';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const login = () => {
        setIsLoggedIn(true);
    };
    
    const handleLogin = (username, password) => {
        return axios.post(`${BASE_URL}/login`, { username, password })
         .then((res) => {
            if (res.data.status === "success") {
              const token = res.data.token;
              sessionStorage.setItem('loginToken', token);
              login();
              setUsername('');
              setPassword('');
              setErrorMessage('');
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

      return (
        <AuthContext.Provider value={{ isLoggedIn, login, handleLogin, username, setUsername, password, setPassword, errorMessage, setErrorMessage }}>
          {children}
        </AuthContext.Provider>
      );
};

export { AuthProvider, AuthContext };
