import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === 'ROLE_ADMIN') navigate('/admin');
      else if (user.role === 'ROLE_COMPANY') navigate('/company');
      else if (user.role === 'ROLE_STUDENT') navigate('/student');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', JSON.stringify(data));
        
        toast.success('Login successful!');
        
        if (data.role === 'ROLE_ADMIN') navigate('/admin');
        else if (data.role === 'ROLE_COMPANY') {
          // Fetch company profile to get slug
          const profileRes = await fetch(`http://localhost:8081/api/companies/profile/${data.userId}`);
          if (profileRes.ok) {
            const company = await profileRes.json();
            navigate(`/company/${company.slug}`);
          } else {
            navigate('/company'); // Fallback
          }
        }
        else if (data.role === 'ROLE_STUDENT') navigate('/student');
      } else if (response.status === 403) {
        toast.error('Account not verified. Redirecting to verification...');
        setTimeout(() => navigate(`/verify-otp?email=${email}`), 2000);
      } else {
        const errorData = await response.text();
        toast.error(errorData || 'Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      toast.error('Connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <div className="card glass-panel animate-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
