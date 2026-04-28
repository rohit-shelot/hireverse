import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    minCgpa: '',
    minTenthPercentage: '',
    minTwelfthPercentage: '',
    collegeId: ''
  });

  const [profileForm, setProfileForm] = useState({ name: '', industry: '', location: '' });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.userId) {
      if (user.role === 'ROLE_ADMIN') {
        fetchAllJobsForAdmin();
        fetchColleges();
      } else {
        fetchCompanyProfile();
        fetchColleges();
      }
    }
  }, []);

  const fetchAllJobsForAdmin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/students/jobs');
      if (response.ok) setJobs(await response.json());
    } catch (error) { toast.error('Failed to load all jobs'); }
    finally { setLoading(false); }
  };

  const fetchCompanyProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/companies/profile/${user.userId}`);
      if (response.ok) {
        const data = await response.json();
        setCompany(data);
        setProfileForm({ name: data.name, industry: data.industry, location: data.location });
        fetchJobs(data.id);
      }
    } catch (error) { toast.error('Failed to load profile'); }
  };

  const fetchColleges = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/companies/colleges');
      if (res.ok) setColleges(await res.json());
    } catch (error) { console.error(error); }
  };

  const fetchJobs = async (companyId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/companies/${companyId}/jobs`);
      if (response.ok) setJobs(await response.json());
    } catch (error) { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/companies/jobs/${jobId}/applicants`);
      if (response.ok) {
        setApplicants(await response.json());
        setViewingApplicantsFor(jobId);
      }
    } catch (error) { toast.error('Failed to load applicants'); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/companies/profile/${user.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (response.ok) {
        const updated = await response.json();
        setCompany(updated);
        setIsEditingProfile(false);
        toast.success('Profile updated!');
        localStorage.setItem('user', JSON.stringify({ ...user, name: updated.name }));
      }
    } catch (error) { toast.error('Update failed'); }
  };

  const openJobModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobForm({
        title: job.title,
        description: job.description,
        minCgpa: job.minCgpa,
        minTenthPercentage: job.minTenthPercentage,
        minTwelfthPercentage: job.minTwelfthPercentage,
        collegeId: job.collegeId || ''
      });
    } else {
      setEditingJob(null);
      setJobForm({ title: '', description: '', minCgpa: '', minTenthPercentage: '', minTwelfthPercentage: '', collegeId: '' });
    }
    setShowModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const url = editingJob ? `http://localhost:8081/api/companies/jobs/${editingJob.id}` : 'http://localhost:8081/api/companies/jobs';
    try {
      const response = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobForm, companyId: company.id })
      });
      if (response.ok) {
        toast.success(editingJob ? 'Job updated!' : 'Job posted!');
        setShowModal(false);
        fetchJobs(company.id);
      }
    } catch (error) { toast.error('Action failed'); }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Company Dashboard</h1>
          {company && <p className="badge badge-primary">{company.name} | {company.industry}</p>}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user.role === 'ROLE_COMPANY' && (
            <>
              <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn btn-secondary">{isEditingProfile ? 'Cancel' : 'Edit Profile'}</button>
              <button onClick={() => openJobModal()} className="btn btn-primary">Post New Role</button>
            </>
          )}
        </div>
      </div>

      {isEditingProfile && (
        <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>Edit Company Profile</h3>
          <form onSubmit={handleUpdateProfile} style={{ marginTop: '1rem' }} className="grid-3">
            <input type="text" className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} placeholder="Name" required />
            <input type="text" className="input-field" value={profileForm.industry} onChange={e => setProfileForm({...profileForm, industry: e.target.value})} placeholder="Industry" required />
            <input type="text" className="input-field" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} placeholder="Location" required />
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      )}

      {showModal && (
        <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>{editingJob ? 'Edit Job' : 'New Job'}</h3>
          <form onSubmit={handleSaveJob} style={{ marginTop: '1rem' }}>
            <div className="grid-2">
              <input type="text" className="input-field" placeholder="Job Title" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
              <select className="input-field" value={jobForm.collegeId} onChange={e => setJobForm({...jobForm, collegeId: e.target.value})} required>
                <option value="">Select Target College</option>
                {colleges.map(c => <option key={c.id} value={c.id}>{c.name} ({c.location})</option>)}
              </select>
              <input type="number" step="0.1" className="input-field" placeholder="Min CGPA" value={jobForm.minCgpa} onChange={e => setJobForm({...jobForm, minCgpa: e.target.value})} required />
              <input type="number" className="input-field" placeholder="Min 10th %" value={jobForm.minTenthPercentage} onChange={e => setJobForm({...jobForm, minTenthPercentage: e.target.value})} required />
              <input type="number" className="input-field" placeholder="Min 12th %" value={jobForm.minTwelfthPercentage} onChange={e => setJobForm({...jobForm, minTwelfthPercentage: e.target.value})} required />
            </div>
            <textarea className="input-field" style={{ marginTop: '1rem' }} rows="3" placeholder="Description" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} required />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">{editingJob ? 'Update' : 'Post'}</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <h2>Active Postings</h2>
      {loading ? <p style={{ textAlign: 'center' }}>Loading...</p> : (
        <div className="grid-2" style={{ marginTop: '1rem' }}>
          {jobs.map(job => (
            <div key={job.id} className="card glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>{job.title}</h3>
                {user.role === 'ROLE_COMPANY' && (
                  <button onClick={() => openJobModal(job)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem' }}>Edit</button>
                )}
              </div>
              <p style={{ color: 'var(--primary)', fontWeight: '500', margin: '0.5rem 0' }}>📍 {job.collegeName} ({job.collegeLocation})</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{job.description}</p>
              <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '0.8rem' }}>
                CGPA: {job.minCgpa} | 10th: {job.minTenthPercentage}% | 12th: {job.minTwelfthPercentage}%
              </div>
              <button 
                onClick={() => fetchApplicants(job.id)} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem' }}
              >
                View Applicants
              </button>
            </div>
          ))}
        </div>
      )}

      {viewingApplicantsFor && (
        <div className="animate-in" style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Applicants for {jobs.find(j => j.id === viewingApplicantsFor)?.title}</h2>
            <button onClick={() => setViewingApplicantsFor(null)} className="btn btn-secondary">Close List</button>
          </div>
          
          <div className="data-table-container card glass-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(app => (
                  <tr key={app.id}>
                    <td><strong>{app.student.name}</strong></td>
                    <td>{app.student.cgpa}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {app.student.skills.map((s, i) => <span key={i} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{s}</span>)}
                      </div>
                    </td>
                    <td>{app.student.location}</td>
                    <td><span className="badge badge-success">{app.status}</span></td>
                  </tr>
                ))}
                {applicants.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No applications received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
