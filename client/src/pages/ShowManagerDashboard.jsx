import React, { useState, useEffect } from 'react';
import { movieService, hallService, showService, bookingService, reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ShowManagerDashboard() {
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('shows');
  const [showForm, setShowForm] = useState(false);
  const [showFormHall, setShowFormHall] = useState(false);
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

  const openForm = () => {
    setFormData({ movieId: '', hallId: '', startTime: '', price: '' });
    setShowForm(true);
  };

  const openFormHall = (item = null) => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({ name: '', location: '', capacity: '', balconyCapacity: '', premiumCapacity: '', ordinaryCapacity: '', balconyPrice: '', premiumPrice: '', ordinaryPrice: '' });
    }
    setShowFormHall(true);
  };

  const handleSubmitHall = async (e) => {
    e.preventDefault();
    try {
      if (formData.hallId) {
        await hallService.update(formData.hallId, formData);
      } else {
        await hallService.create(formData);
      }
      setShowFormHall(false);
      loadData();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await showService.create(formData);
      setShowForm(false);
      loadData();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-purple-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">OMTMS - Show Manager</h1>
        <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
      </nav>
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {['shows', 'halls', 'bookings', 'verify', 'reports'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white'}`}>
              {tab === 'shows' ? 'Manage Shows' : tab === 'halls' ? 'Hall Config' : tab === 'bookings' ? 'All Bookings' : tab === 'verify' ? 'Verify Tickets' : 'Reports'}
            </button>
          ))}
        </div>
        
        {activeTab === 'shows' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Shows</h2>
              <button onClick={openForm} className="bg-purple-600 text-white px-4 py-1 rounded">+ Add Show</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Movie</th><th>Hall</th><th>Time</th><th>Price</th></tr></thead>
              <tbody>
                {shows.map(s => <tr key={s.showId}><td>{s.showId}</td><td>{s.movieName}</td><td>{s.hallName}</td><td>{s.startTime}</td><td>${s.price}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'halls' && (
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Hall Configuration</h2>
              <button onClick={openFormHall} className="bg-purple-600 text-white px-4 py-1 rounded">+ Add/Edit Hall</button>
            </div>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>Cap</th><th>B/P/O</th><th>$/B/P/O</th></tr></thead>
              <tbody>
                {halls.map(h => <tr key={h.hallId}><td>{h.hallId}</td><td>{h.name}</td><td>{h.location}</td><td>{h.capacity}</td><td>{h.balconyCapacity}/{h.premiumCapacity}/{h.ordinaryCapacity}</td><td>${h.balconyPrice}/${h.premiumPrice}/${h.ordinaryPrice}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">All Bookings</h2>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Movie</th><th>Customer</th><th>Amount</th><th>Status</th><th>Ticket Code</th></tr></thead>
              <tbody>
                {bookings.map(b => <tr key={b.bookingId}><td>{b.bookingId}</td><td>{b.movieName}</td><td>{b.customerName}</td><td>${b.totalAmount}</td><td>{b.status}</td><td>{b.ticketCode || '-'}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'verify' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Verify Tickets</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" value={ticketCode} onChange={e => setTicketCode(e.target.value)} 
                placeholder="Enter ticket code (e.g., TKT-ABC12345)" className="flex-1 p-2 border rounded" />
              <button onClick={handleVerify} className="bg-purple-600 text-white px-4 py-2 rounded">Verify</button>
            </div>
            {verifyResult && (
              <div className={`p-4 rounded ${verifyResult.error ? 'bg-red-100' : 'bg-green-100'}`}>
                {verifyResult.error ? (
                  <p className="text-red-600">{verifyResult.error}</p>
                ) : (
                  <div>
                    <p className="font-bold">Ticket Verified!</p>
                    <p>Movie: {verifyResult.movieName}</p>
                    <p>Customer: {verifyResult.customerName}</p>
                    <p>Status: {verifyResult.status}</p>
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
              <button onClick={async () => {
                const r = await reportService.getBookingReport();
                alert(JSON.stringify(r.data, null, 2));
              }} className="bg-purple-600 text-white p-4 rounded">Booking Report</button>
              <button onClick={async () => {
                const r = await reportService.getShowReport();
                alert(JSON.stringify(r.data, null, 2));
              }} className="bg-purple-600 text-white p-4 rounded">Show Report</button>
            </div>
          </div>
        )}
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Show</h3>
            <form onSubmit={handleSubmit}>
              <select value={formData.movieId || ''} onChange={e => setFormData({...formData, movieId: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required>
                <option value="">Select Movie</option>
                {movies.map(m => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
              </select>
              <select value={formData.hallId || ''} onChange={e => setFormData({...formData, hallId: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required>
                <option value="">Select Hall</option>
                {halls.map(t => <option key={t.hallId} value={t.hallId}>{t.name}</option>)}
              </select>
              <input type="datetime-local" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full p-2 mb-3 border rounded" required />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-purple-600 text-white p-2 rounded">Create</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-500 text-white p-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFormHall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">{formData.hallId ? 'Edit Hall' : 'Add Hall'}</h3>
            <form onSubmit={handleSubmitHall}>
              <input type="text" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 mb-3 border rounded" required />
              <input type="number" placeholder="Total Capacity" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} className="w-full p-2 mb-3 border rounded" required />
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
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-purple-600 text-white p-2 rounded">Save</button>
                <button type="button" onClick={() => setShowFormHall(false)} className="flex-1 bg-gray-500 text-white p-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
