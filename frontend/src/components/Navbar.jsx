import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-brand">
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #A78BFA, #4F46E5)' }}></div>
        HireVerse
      </Link>

      {isAuthenticated && (
        <div className="nav-links">
          {role === 'ROLE_ADMIN' && <Link to="/admin" className="nav-link">Admin Dashboard</Link>}
          {role === 'ROLE_COMPANY' && <Link to="/company" className="nav-link">Company Panel</Link>}
          {role === 'ROLE_STUDENT' && <Link to="/student" className="nav-link">Opportunities</Link>}

          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        </div>
      )}
      {!isAuthenticated && (
        <div className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
