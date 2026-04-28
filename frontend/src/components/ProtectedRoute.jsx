import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Role mismatch
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'ROLE_STUDENT') return <Navigate to="/student" replace />;
    if (user.role === 'ROLE_COMPANY') return <Navigate to="/company" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
