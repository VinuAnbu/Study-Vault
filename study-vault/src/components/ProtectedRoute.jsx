import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getUser } from '../services/authService';

const ProtectedRoute = ({ children }) => {

  const user = localStorage.getItem("user"); // Ensure user data is properly parsed


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
