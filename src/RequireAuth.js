import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { Navigate, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
  const { isLoggedIn, login } = useContext(AuthContext);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('loginToken');
    if (storedToken) {
      login();
    }
    setIsAuthChecked(true);
  }, [login]);

  if (!isAuthChecked) {
    return null; // Optionally, render a loading indicator while auth check is in progress
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
export default RequireAuth;
