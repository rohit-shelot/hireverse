import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../api';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  
  const [newCollege, setNewCollege] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentRes = await fetch(`${API_BASE_URL}/api/admin/students`);
      const companyRes = await fetch(`${API_BASE_URL}/api/admin/companies`);
      const collegeRes = await fetch(`${API_BASE_URL}/api/admin/colleges`);

      if (studentRes.ok) setStudents(await studentRes.json());
      if (companyRes.ok) setCompanies(await companyRes.json());
      if (collegeRes.ok) setColleges(await collegeRes.json());
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    console.log('Adding college:', newCollege);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/colleges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollege)
      });
      
      if (res.ok) {
        const data = await res.json();
        toast.success('College added successfully!');
        setNewCollege({ name: '', location: '' });
        setColleges([...colleges, data]);
      } else {
        // If not OK, the body might not be JSON (e.g. 403 HTML error page)
        let errorMsg = `Server error: ${res.status}`;
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch (e) {
          console.error('Non-JSON error response');
        }
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Add college error:', error);
      toast.error('Network error while adding college');
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Delete student?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Student deleted');
        setStudents(students.filter(s => s.id !== id));
      }
    } catch (error) { toast.error('Error deleting student'); }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm('Delete company?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/companies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Company deleted');
        setCompanies(companies.filter(c => c.id !== id));
      }
    } catch (error) { toast.error('Error deleting company'); }
  };

  const deleteCollege = async (id) => {
    if (!window.confirm('Remove this college?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/colleges/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('College removed');
        setColleges(colleges.filter(c => c.id !== id));
      }
    } catch (error) { toast.error('Error removing college'); }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage platform entities and campus drives.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData}>Refresh Data</button>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students ({students.length})</div>
        <div className={`tab ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Companies ({companies.length})</div>
        <div className={`tab ${activeTab === 'colleges' ? 'active' : ''}`} onClick={() => setActiveTab('colleges')}>Colleges ({colleges.length})</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><p>Loading...</p></div>
      ) : (
        <div className="data-table-container">
          {activeTab === 'students' && (
            <table className="data-table">
              <thead><tr><th>Name</th><th>CGPA</th><th>Location</th><th>Actions</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}><td>{s.name}</td><td>{s.cgpa}</td><td>{s.location}</td>
                  <td><button className="btn btn-danger" onClick={() => deleteStudent(s.id)}>Delete</button></td></tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'companies' && (
            <table className="data-table">
              <thead><tr><th>Company</th><th>Industry</th><th>Location</th><th>Actions</th></tr></thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.id}><td>{c.name}</td><td>{c.industry}</td><td>{c.location}</td>
                  <td><button className="btn btn-danger" onClick={() => deleteCompany(c.id)}>Delete</button></td></tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'colleges' && (
            <div style={{ padding: '1.5rem' }}>
              <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
                <h3>Add New Campus College</h3>
                <form onSubmit={handleAddCollege} style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>College Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={newCollege.name} 
                      onChange={e => setNewCollege({...newCollege, name: e.target.value})} 
                      placeholder="e.g. IIT Bombay"
                      required 
                    />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Location</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={newCollege.location} 
                      onChange={e => setNewCollege({...newCollege, location: e.target.value})} 
                      placeholder="e.g. Mumbai"
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 2rem' }}>Add</button>
                </form>
              </div>
              
              <table className="data-table">
                <thead><tr><th>College Name</th><th>Location</th><th>Actions</th></tr></thead>
                <tbody>
                  {colleges.map(c => (
                    <tr key={c.id}><td>{c.name}</td><td>{c.location}</td>
                    <td><button className="btn btn-danger" onClick={() => deleteCollege(c.id)}>Remove</button></td></tr>
                  ))}
                  {colleges.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No colleges found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
