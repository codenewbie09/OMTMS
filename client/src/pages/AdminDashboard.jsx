import React, { useState, useEffect } from 'react';
import { movieService, hallService, showService, reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [shows, setShows] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setMovies((await movieService.getAll()).data);
    setHalls((await hallService.getAll()).data);
    setShows((await showService.getAll()).data);
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    if (type === 'movie') await movieService.delete(id);
    if (type === 'hall') await hallService.delete(id);
    if (type === 'show') await showService.delete(id);
    loadData();
  };

  const openForm = (type, item = null) => {
    setActiveTab(type);
    setEditingItem(item);
    setShowForm(true);
    if (item) {
      setFormData(item);
    } else {
      setFormData(type === 'shows' ? { movieId: '', hallId: '', startTime: '', price: '' } : 
                  type === 'halls' ? { name: '', location: '', capacity: '' } :
                  { title: '', genre: '', duration: '', releaseDate: '', rating: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        if (activeTab === 'movies') await movieService.update(editingItem.movieId, formData);
        if (activeTab === 'halls') await hallService.update(editingItem.hallId, formData);
        if (activeTab === 'shows') await showService.update(editingItem.showId, formData);
      } else {
        if (activeTab === 'movies') await movieService.create(formData);
        if (activeTab === 'halls') await hallService.create(formData);
        if (activeTab === 'shows') await showService.create(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      loadData();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const loadReport = async (reportType) => {
    try {
      let response;
      switch (reportType) {
        case 'summary': response = await reportService.getSummaryReport(); break;
        case 'movies': response = await reportService.getMovieReport(); break;
        case 'halls': response = await reportService.getHallReport(); break;
        case 'shows': response = await reportService.getShowReport(); break;
        case 'bookings': response = await reportService.getBookingReport(); break;
        default: response = await reportService.getSummaryReport();
      }
      setReportData(response.data);
    } catch (err) {
      alert('Failed to load report: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h3>
        <form onSubmit={handleSubmit}>
          {activeTab === 'movies' && (
            <>
              <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="text" placeholder="Genre" value={formData.genre || ''} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="number" placeholder="Duration (minutes)" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required />
              <input type="date" placeholder="Release Date" value={formData.releaseDate || ''} onChange={e => setFormData({...formData, releaseDate: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="number" step="0.1" placeholder="Rating" value={formData.rating || ''} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full p-2 mb-3 border rounded" required />
            </>
          )}
          {activeTab === 'halls' && (
            <>
              <input type="text" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="number" placeholder="Total Capacity" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required />
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-600">Balcony Cap</label>
                  <input type="number" placeholder="Balcony" value={formData.balconyCapacity || ''} onChange={e => setFormData({...formData, balconyCapacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Premium Cap</label>
                  <input type="number" placeholder="Premium" value={formData.premiumCapacity || ''} onChange={e => setFormData({...formData, premiumCapacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Ordinary Cap</label>
                  <input type="number" placeholder="Ordinary" value={formData.ordinaryCapacity || ''} onChange={e => setFormData({...formData, ordinaryCapacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="text-xs text-gray-600">Balcony Price</label>
                  <input type="number" placeholder="₹350" value={formData.balconyPrice || ''} onChange={e => setFormData({...formData, balconyPrice: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Premium Price</label>
                  <input type="number" placeholder="₹250" value={formData.premiumPrice || ''} onChange={e => setFormData({...formData, premiumPrice: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Ordinary Price</label>
                  <input type="number" placeholder="₹150" value={formData.ordinaryPrice || ''} onChange={e => setFormData({...formData, ordinaryPrice: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
              </div>
            </>
          )}
          {activeTab === 'shows' && (
            <>
              <select value={formData.movieId || ''} onChange={e => setFormData({...formData, movieId: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required>
                <option value="">Select Movie</option>
                {movies.map(m => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
              </select>
              <select value={formData.hallId || ''} onChange={e => setFormData({...formData, hallId: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required>
                <option value="">Select Hall</option>
                {halls.map(t => <option key={t.hallId} value={t.hallId}>{t.name}</option>)}
              </select>
              <input type="datetime-local" placeholder="Start Time" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-2 mb-3 border rounded" required />
            </>
          )}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-green-500 text-white p-2 rounded">{editingItem ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="flex-1 bg-gray-500 text-white p-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderReport = () => {
    if (!reportData) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['summary', 'movies', 'halls', 'shows', 'bookings'].map(type => (
            <button key={type} onClick={() => loadReport(type)} className="bg-white p-6 rounded shadow hover:bg-gray-50">
              <h3 className="text-lg font-semibold capitalize">{type} Report</h3>
              <p className="text-gray-500">Click to generate</p>
            </button>
          ))}
        </div>
      );
    }

    const data = reportData.data || {};
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{reportData.reportType}</h3>
          <button onClick={() => setReportData(null)} className="bg-gray-500 text-white px-4 py-1 rounded">Back</button>
        </div>
        <div className="bg-white p-4 rounded overflow-x-auto">
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">OMTMS Admin</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
      </nav>
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {['movies', 'halls', 'shows', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {activeTab === 'movies' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Movies</h2>
              <button onClick={() => openForm('movies')} className="bg-green-500 text-white px-4 py-1 rounded">+ Add Movie</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Title</th><th>Genre</th><th>Duration</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {movies.length === 0 ? <tr><td colSpan={6} className="text-center py-4">No movies yet</td></tr> :
                movies.map(m => <tr key={m.movieId}><td>{m.movieId}</td><td>{m.title}</td><td>{m.genre}</td><td>{m.duration} min</td><td>{m.rating}</td><td>
                  <button onClick={() => openForm('movies', m)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete('movie', m.movieId)} className="text-red-500">Delete</button>
                </td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'halls' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Halls</h2>
              <button onClick={() => openForm('halls')} className="bg-green-500 text-white px-4 py-1 rounded">+ Add Hall</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>Capacity</th><th>Actions</th></tr></thead>
              <tbody>
                {halls.length === 0 ? <tr><td colSpan={5} className="text-center py-4">No halls yet</td></tr> :
                halls.map(t => <tr key={t.hallId}><td>{t.hallId}</td><td>{t.name}</td><td>{t.location}</td><td>{t.capacity}</td><td>
                  <button onClick={() => openForm('halls', t)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete('hall', t.hallId)} className="text-red-500">Delete</button>
                </td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'shows' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Shows</h2>
              <button onClick={() => openForm('shows')} className="bg-green-500 text-white px-4 py-1 rounded">+ Add Show</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Movie</th><th>Hall</th><th>Time</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {shows.length === 0 ? <tr><td colSpan={6} className="text-center py-4">No shows yet</td></tr> :
                shows.map(s => <tr key={s.showId}><td>{s.showId}</td><td>{s.movieName}</td><td>{s.hallName}</td><td>{s.startTime}</td><td>${s.price}</td><td>
                  <button onClick={() => openForm('shows', s)} className="text-blue-500 mr-2">Edit</button>
                  <button onClick={() => handleDelete('show', s.showId)} className="text-red-500">Delete</button>
                </td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Reports</h2>
            {renderReport()}
          </div>
        )}
      </div>
      {showForm && renderForm()}
    </div>
  );
}
