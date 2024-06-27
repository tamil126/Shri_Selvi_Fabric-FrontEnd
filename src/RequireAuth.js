import { useContext } from 'react';
import { AuthContext } from './authContext';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
export default RequireAuth;