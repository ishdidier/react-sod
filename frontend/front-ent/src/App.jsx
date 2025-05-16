 import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ fullName: '', postName: '', score: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCandidates = () => {
    axios.get('http://localhost:4000/api/candidates').then(res => setCandidates(res.data));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://localhost:4000/api/candidates/${editingId}`, form).then(() => {
        fetchCandidates();
        setForm({ fullName: '', postName: '', score: '' });
        setEditingId(null);
      });
    } else {
      axios.post('http://localhost:4000/api/candidates', form).then(res => {
        setCandidates([...candidates, res.data]);
        setForm({ fullName: '', postName: '', score: '' });
      });
    }
  };

  const handleEdit = candidate => {
    setForm({ fullName: candidate.fullName, postName: candidate.postName, score: candidate.score });
    setEditingId(candidate._id);
  };

  const handleDelete = id => {
    axios.delete(`http://localhost:4000/api/candidates/${id}`).then(() => fetchCandidates());
  };

   const style={
    padding: '20px',
    margin: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px #ccc',
    display: 'block',
  }


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Cafe camillia Candidate Management</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <button type="submit">{editingId ? 'Update' : 'Add'} Candidate</button>
        <input placeholder="Full Name" value={form.fullName} style={style} onChange={e => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Post Name" value={form.postName} style={style} onChange={e => setForm({ ...form, postName: e.target.value })} />
        <input type="number" placeholder="Score" value={form.score} style={style} onChange={e => setForm({ ...form, score: e.target.value })} />
        
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Post Name</th>
            <th>Score</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(c => (
            <tr key={c._id}>
              <td>{c.fullName}</td>
              <td>{c.postName}</td>
              <td>{c.score}</td>
              <td><strong>{c.result}</strong></td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  

export default App;