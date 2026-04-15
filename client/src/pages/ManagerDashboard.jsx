import React, { useState, useEffect } from 'react';
import { movieService, hallService, showService, bookingService, reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [ticketCode, setTicketCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setMovies((await movieService.getAll()).data);
    setHalls((await hallService.getAll()).data);
    setShows((await showService.getAll()).data);
    setBookings((await bookingService.getAll()).data);
  };

  const openForm = (type, item = null) => {
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
      if (formData.movieId) {
        await showService.create(formData);
      } else if (formData.capacity) {
        await hallService.create(formData);
      } else {
        await movieService.create(formData);
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure?')) return;
    try {
      if (type === 'movie') await movieService.delete(id);
      if (type === 'hall') await hallService.delete(id);
      if (type === 'show') await showService.delete(id);
      loadData();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleVerify = async () => {
    if (!ticketCode) return;
    try {
      const response = await bookingService.verifyTicket(ticketCode);
      setVerifyResult(response.data);
    } catch (err) {
      setVerifyResult({ error: err.response?.data?.message || err.message });
    }
  };

  const handleRefund = async (bookingId, amount) => {
    try {
      await bookingService.refund(bookingId, amount);
      alert('Refund processed');
      loadData();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const stats = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter(b => b.status === 'CONFIRMED').length,
    cancelledBookings: bookings.filter(b => b.status === 'CANCELLED').length,
    totalRevenue: bookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    totalMovies: movies.length,
    totalHalls: halls.length,
    totalShows: shows.length
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-800 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">OMTMS - Manager</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
      </nav>
      
      <div className="p-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['dashboard', 'movies', 'halls', 'shows', 'bookings', 'verify', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-800 text-white' : 'bg-white'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">Shows</p>
              <p className="text-2xl font-bold">{stats.totalShows}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'movies' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Movies</h2>
              <button onClick={() => openForm('movies')} className="bg-blue-800 text-white px-4 py-1 rounded">+ Add Movie</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Title</th><th>Genre</th><th>Duration</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {movies.map(m => <tr key={m.movieId}><td>{m.movieId}</td><td>{m.title}</td><td>{m.genre}</td><td>{m.duration}</td><td>{m.rating}</td><td><button onClick={() => handleDelete('movie', m.movieId)} className="text-red-500">Delete</button></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'halls' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Halls</h2>
              <button onClick={() => openForm('halls')} className="bg-blue-800 text-white px-4 py-1 rounded">+ Add Hall</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>Cap</th><th>B/P/O</th><th>$/B/P/O</th><th>Actions</th></tr></thead>
              <tbody>
                {halls.map(t => <tr key={t.hallId}>
                  <td>{t.hallId}</td>
                  <td>{t.name}</td>
                  <td>{t.location}</td>
                  <td>{t.capacity}</td>
                  <td>{t.balconyCapacity}/{t.premiumCapacity}/{t.ordinaryCapacity}</td>
                  <td>{t.balconyPrice}/{t.premiumPrice}/{t.ordinaryPrice}</td>
                  <td><button onClick={() => handleDelete('hall', t.hallId)} className="text-red-500">Delete</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'shows' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Shows</h2>
              <button onClick={() => openForm('shows')} className="bg-blue-800 text-white px-4 py-1 rounded">+ Add Show</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Movie</th><th>Hall</th><th>Time</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {shows.map(s => <tr key={s.showId}><td>{s.showId}</td><td>{s.movieName}</td><td>{s.hallName}</td><td>{s.startTime}</td><td>${s.price}</td><td><button onClick={() => handleDelete('show', s.showId)} className="text-red-500">Delete</button></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">All Bookings</h2>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Movie</th><th>Customer</th><th>Amount</th><th>Status</th><th>Ticket Code</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map(b => <tr key={b.bookingId}>
                  <td>{b.bookingId}</td>
                  <td>{b.movieName}</td>
                  <td>{b.customerName}</td>
                  <td>${b.totalAmount}</td>
                  <td><span className={`px-2 py-1 rounded text-xs ${b.status === 'CONFIRMED' ? 'bg-green-100' : 'bg-red-100'}`}>{b.status}</span></td>
                  <td>{b.ticketCode || '-'}</td>
                  <td>
                    {b.status === 'CONFIRMED' && <button onClick={() => handleRefund(b.bookingId, b.totalAmount * 0.9)} className="text-blue-500 text-sm mr-2">Refund</button>}
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'verify' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Verify Tickets</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" value={ticketCode} onChange={e => setTicketCode(e.target.value)} 
                placeholder="Enter ticket code" className="flex-1 p-2 border rounded" />
              <button onClick={handleVerify} className="bg-blue-800 text-white px-4 py-2 rounded">Verify</button>
            </div>
            {verifyResult && (
              <div className={`p-4 rounded ${verifyResult.error ? 'bg-red-100' : 'bg-green-100'}`}>
                {verifyResult.error ? <p className="text-red-600">{verifyResult.error}</p> : (
                  <div>
                    <p className="font-bold">Valid Ticket</p>
                    <p>Movie: {verifyResult.movieName}</p>
                    <p>Hall: {verifyResult.hallName}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Reports</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={async () => { const r = await reportService.getSummaryReport(); alert(JSON.stringify(r.data, null, 2)); }} className="bg-blue-800 text-white p-4 rounded">Summary Report</button>
              <button onClick={async () => { const r = await reportService.getBookingReport(); alert(JSON.stringify(r.data, null, 2)); }} className="bg-blue-800 text-white p-4 rounded">Booking Report</button>
              <button onClick={async () => { const r = await reportService.getMovieReport(); alert(JSON.stringify(r.data, null, 2)); }} className="bg-blue-800 text-white p-4 rounded">Movie Report</button>
              <button onClick={async () => { const r = await reportService.getHallReport(); alert(JSON.stringify(r.data, null, 2)); }} className="bg-blue-800 text-white p-4 rounded">Hall Report</button>
            </div>
          </div>
        )}
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">{activeTab === 'movies' ? 'Add Movie' : activeTab === 'halls' ? 'Add Hall' : 'Add Show'}</h3>
            <form onSubmit={handleSubmit}>
              {activeTab === 'movies' && (
                <>
                  <input type="text" placeholder="Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 mb-3 border rounded" />
                  <input type="text" placeholder="Genre" value={formData.genre || ''} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full p-2 mb-3 border rounded" />
                  <input type="number" placeholder="Duration" value={formData.duration || ''} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" />
                  <input type="number" placeholder="Rating" value={formData.rating || ''} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full p-2 mb-3 border rounded" />
                </>
              )}
              {activeTab === 'halls' && (
                <>
                  <input type="text" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 mb-3 border rounded" />
                  <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 mb-3 border rounded" />
                  <input type="number" placeholder="Total Capacity" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" />
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <input type="number" placeholder="Balcony Cap" value={formData.balconyCapacity || ''} onChange={e => setFormData({...formData, balconyCapacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Premium Cap" value={formData.premiumCapacity || ''} onChange={e => setFormData({...formData, premiumCapacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Ordinary Cap" value={formData.ordinaryCapacity || ''} onChange={e => setFormData({...formData, ordinaryCapacity: parseInt(e.target.value)})} className="w-full p-2 border rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <input type="number" placeholder="Balcony $" value={formData.balconyPrice || ''} onChange={e => setFormData({...formData, balconyPrice: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Premium $" value={formData.premiumPrice || ''} onChange={e => setFormData({...formData, premiumPrice: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                    <input type="number" placeholder="Ordinary $" value={formData.ordinaryPrice || ''} onChange={e => setFormData({...formData, ordinaryPrice: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                  </div>
                </>
              )}
              {activeTab === 'shows' && (
                <>
                  <select value={formData.movieId || ''} onChange={e => setFormData({...formData, movieId: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded">
                    <option value="">Select Movie</option>
                    {movies.map(m => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
                  </select>
                  <select value={formData.hallId || ''} onChange={e => setFormData({...formData, hallId: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded">
                    <option value="">Select Hall</option>
                    {halls.map(h => <option key={h.hallId} value={h.hallId}>{h.name}</option>)}
                  </select>
                  <input type="datetime-local" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 mb-3 border rounded" />
                  <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-2 mb-3 border rounded" />
                </>
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-800 text-white p-2 rounded">Create</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-500 text-white p-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
