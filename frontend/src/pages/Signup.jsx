import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_BASE_URL from '../api';

const Signup = () => {
  const [role, setRole] = useState('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    skills: '',
    location: '',
    industry: ''
  });
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = role === 'STUDENT' ? '/api/auth/signup/student' : '/api/auth/signup/company';
    const payload = role === 'STUDENT' ? {
      ...formData,
      cgpa: parseFloat(formData.cgpa),
      tenthPercentage: parseFloat(formData.tenthPercentage),
      twelfthPercentage: parseFloat(formData.twelfthPercentage),
      skills: formData.skills.split(',').map(s => s.trim())
    } : {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      industry: formData.industry,
      location: formData.location
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.text();

      if (response.ok) {
        if (role === 'STUDENT') {
          toast.success('Registration successful! Check your email for OTP.');
          navigate(`/verify-otp?email=${formData.email}`);
        } else {
          toast.success('Registration successful! Please login.');
          navigate('/login');
        }
      } else {
        toast.error(data || 'Registration failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-in" style={{ maxWidth: '850px', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          Join HireVerse
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>The future of campus recruitment starts here.</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div 
          onClick={() => setRole('STUDENT')}
          style={{
            flex: 1,
            padding: '2rem',
            borderRadius: '20px',
            background: role === 'STUDENT' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255,255,255,0.03)',
            border: `2px solid ${role === 'STUDENT' ? '#4F46E5' : 'rgba(255,255,255,0.1)'}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            boxShadow: role === 'STUDENT' ? '0 10px 25px -5px rgba(79, 70, 229, 0.4)' : 'none'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>For Students</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Build your profile, apply to jobs, and launch your career.</p>
        </div>

        <div 
          onClick={() => setRole('COMPANY')}
          style={{
            flex: 1,
            padding: '2rem',
            borderRadius: '20px',
            background: role === 'COMPANY' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255,255,255,0.03)',
            border: `2px solid ${role === 'COMPANY' ? '#4F46E5' : 'rgba(255,255,255,0.1)'}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            boxShadow: role === 'COMPANY' ? '0 10px 25px -5px rgba(79, 70, 229, 0.4)' : 'none'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>For Companies</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Find top talent, manage applications, and hire the best.</p>
        </div>
      </div>

      <div className="card glass-panel" style={{ padding: '3rem', borderRadius: '24px' }}>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></span>
              Account Information
            </h4>
            <div className="grid-2">
              <div className="input-group">
                <label>{role === 'STUDENT' ? 'Full Name' : 'Company Name'}</label>
                <input name="name" type="text" className="input-field" placeholder={role === 'STUDENT' ? 'John Doe' : 'TechCorp Inc.'} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Work Email</label>
                <input name="email" type="email" className="input-field" placeholder="email@example.com" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input name="password" type="password" className="input-field" placeholder="••••••••" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input name="location" type="text" className="input-field" placeholder="City, Country" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '24px', height: '2px', background: 'var(--primary)' }}></span>
              {role === 'STUDENT' ? 'Academic & Professional Details' : 'Company Details'}
            </h4>
            
            {role === 'STUDENT' ? (
              <>
                <div className="grid-3">
                  <div className="input-group">
                    <label>Current CGPA</label>
                    <input name="cgpa" type="number" step="0.01" className="input-field" placeholder="8.50" onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>10th %</label>
                    <input name="tenthPercentage" type="number" step="0.1" className="input-field" placeholder="90.5" onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label>12th %</label>
                    <input name="twelfthPercentage" type="number" step="0.1" className="input-field" placeholder="88.0" onChange={handleChange} required />
                  </div>
                </div>
                <div className="input-group" style={{ marginTop: '1rem' }}>
                  <label>Skills & Expertise</label>
                  <input name="skills" type="text" className="input-field" placeholder="Java, React, SQL, Python..." onChange={handleChange} required />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Separate skills with commas (e.g. Java, Python)</p>
                </div>
              </>
            ) : (
              <div className="input-group">
                <label>Industry Vertical</label>
                <input name="industry" type="text" className="input-field" placeholder="e.g. Software Engineering, FinTech, E-commerce" onChange={handleChange} required />
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '3rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '14px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }} disabled={loading}>
              {loading ? 'Finalizing Setup...' : `Create My ${role === 'STUDENT' ? 'Student' : 'Company'} Account`}
            </button>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Log in to your account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
