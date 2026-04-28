import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../api';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  
  // Edit Profile State
  const [editForm, setEditForm] = useState({
    name: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    location: '',
    skills: ''
  });

  useEffect(() => {
    if (user.userId) {
      fetchStudentProfile();
      fetchJobs();
    }
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/profile/${user.userId}`);
      const data = await response.json();
      if (response.ok) {
        setStudent(data);
        setEditForm({
          name: data.name,
          cgpa: data.cgpa,
          tenthPercentage: data.tenthPercentage,
          twelfthPercentage: data.twelfthPercentage,
          location: data.location,
          skills: data.skills.join(', ')
        });
        fetchAppliedJobs(data.id);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const fetchAppliedJobs = async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/applied-jobs`);
      if (response.ok) {
        setAppliedJobIds(await response.json());
      }
    } catch (error) { console.error('Failed to load applied jobs'); }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/jobs`);
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editForm,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      };

      const response = await fetch(`${API_BASE_URL}/api/students/profile/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updated = await response.json();
        setStudent(updated);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        
        // Update local storage name if changed
        const newUser = { ...user, name: updated.name };
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Connection error');
    }
  };

  const handleApply = async (jobId) => {
    if (!student) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/apply?studentId=${student.id}&jobRoleId=${jobId}`, {
        method: 'POST'
      });
      if (response.ok) {
        toast.success('Applied successfully!');
        setAppliedJobIds([...appliedJobIds, jobId]);
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to apply');
      }
    } catch (error) {
      toast.error('Connection failed');
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Student Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover opportunities and manage your professional profile.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      {isEditing && (
        <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>Edit Your Profile</h3>
          <form onSubmit={handleUpdateProfile} style={{ marginTop: '1rem' }}>
            <div className="grid-2">
              <div className="input-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Current CGPA</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field" 
                  value={editForm.cgpa}
                  onChange={(e) => setEditForm({...editForm, cgpa: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>10th Percentage</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={editForm.tenthPercentage}
                  onChange={(e) => setEditForm({...editForm, tenthPercentage: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>12th Percentage</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={editForm.twelfthPercentage}
                  onChange={(e) => setEditForm({...editForm, twelfthPercentage: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Skills (comma separated)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Java, React, SQL..."
                  value={editForm.skills}
                  onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      )}

      {!isEditing && student && (
        <div className="card glass-panel" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>{student.name}</h2>
              <p style={{ color: 'var(--text-muted)' }}>📍 {student.location} | CGPA: {student.cgpa}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {student.skills?.map((skill, i) => (
                <span key={i} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <h2>Available Opportunities</h2>
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Finding best matches...</p>
      ) : (
        <div className="grid-2" style={{ marginTop: '1rem' }}>
          {jobs.map(job => {
            // Simple match logic
            const cgpaMatch = student ? student.cgpa >= job.minCgpa : true;
            const alreadyApplied = appliedJobIds.includes(job.id);
            return (
              <div key={job.id} className="card glass-panel" style={{ opacity: cgpaMatch ? 1 : 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3>{job.title}</h3>
                    <h4 style={{ color: 'var(--primary)', marginTop: '0.25rem' }}>{job.companyName || 'Unknown Company'}</h4>
                    {job.collegeName && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        🏛️ <strong>College:</strong> {job.collegeName} | 📍 {job.collegeLocation}
                      </p>
                    )}
                  </div>
                  <span className={`badge ${alreadyApplied ? 'badge-success' : (cgpaMatch ? 'badge-success' : 'badge-warning')}`}>
                    {alreadyApplied ? 'Already Applied' : (cgpaMatch ? 'Eligible' : 'Not Eligible')}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: '1rem 0', fontSize: '0.9rem' }}>{job.description}</p>
                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                  <p>🎓 Min CGPA: {job.minCgpa}</p>
                  <p>📜 Min 10th: {job.minTenthPercentage}% | 12th: {job.minTwelfthPercentage}%</p>
                </div>
                <button 
                  className={`btn ${alreadyApplied ? 'btn-secondary' : (cgpaMatch ? 'btn-primary' : 'btn-secondary')}`} 
                  style={{ width: '100%' }}
                  disabled={!cgpaMatch || alreadyApplied}
                  onClick={() => handleApply(job.id)}
                >
                  {alreadyApplied ? 'Applied' : (cgpaMatch ? 'Apply Now' : 'Criteria Not Met')}
                </button>
              </div>
            );
          })}
          {jobs.length === 0 && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No job roles found at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
