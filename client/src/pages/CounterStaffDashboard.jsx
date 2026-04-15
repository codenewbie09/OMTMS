import React, { useState, useEffect } from 'react';
import { movieService, showService, bookingService, hallService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CounterStaffDashboard() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showSeats, setShowSeats] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState('booking');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [moviesRes, showsRes, hallsRes, bookingsRes] = await Promise.all([
      movieService.getAll(),
      showService.getAll(),
      hallService.getAll(),
      bookingService.getAll()
    ]);
    setMovies(moviesRes.data || []);
    setShows(showsRes.data || []);
    setHalls(hallsRes.data || []);
    setBookings(bookingsRes.data || []);
  };

  const movieShows = selectedMovie ? shows.filter(s => s.movieId === selectedMovie.movieId) : [];
  
  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seatId) => {
      const seat = showSeats.find(s => s.seatId === seatId);
      if (seat?.price && seat.price > 0) {
        return sum + seat.price;
      }
      const rowLetter = seat?.row ? seat.row.charCodeAt(0) - 65 : 0;
      const fallbackPrice = rowLetter <= 1 ? 350 : rowLetter <= 3 ? 250 : 150;
      return sum + fallbackPrice;
    }, 0);
  };

  const toggleSeat = (seat) => {
    if (!seat.isAvailable) return;
    setSelectedSeats(prev => 
      prev.includes(seat.seatId) 
        ? prev.filter(s => s !== seat.seatId)
        : [...prev, seat.seatId]
    );
  };

  // Get unique rows from showSeats for dynamic rendering
  const getUniqueRows = () => {
    if (!showSeats || showSeats.length === 0) return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N'];
    const rows = [...new Set(showSeats.map(s => s.row))].sort();
    return rows.length > 0 ? rows : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N'];
  };

  const getMaxSeatNumber = (row) => {
    if (!showSeats || showSeats.length === 0) {
      const rowMap = { A: 10, B: 10, C: 10, D: 0, E: 10, F: 10, G: 10, H: 10, J: 10, K: 10, L: 10, M: 10, N: 10 };
      return rowMap[row] || 10;
    }
    const rowSeats = showSeats.filter(s => s.row === row);
    if (rowSeats.length === 0) return 10;
    return Math.max(...rowSeats.map(s => parseInt(s.seatNumber)));
  };

  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = async () => {
    if (!selectedShow || selectedSeats.length === 0 || !customerName) {
      alert('Please select seats and enter customer name');
      return;
    }
    setShowPayment(true);
  };

  const processPayment = async () => {
    if (!customerEmail) {
      alert('Please enter customer email');
      return;
    }
    setProcessing(true);
    try {
      // First try to get or create customer
      let customerId = 2; // Default customer ID
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create booking
      const result = await bookingService.create({
        customerId: customerId,
        showId: selectedShow.showId,
        seatIds: selectedSeats,
        paymentMethod: 'CASH',
        paymentStatus: 'SUCCESS'
      });
      
      alert(`Booking successful! Ticket Code: ${result.data.ticketCode}`);
      setShowPayment(false);
      setSelectedMovie(null);
      setSelectedShow(null);
      setSelectedSeats([]);
      setShowSeats([]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      loadData();
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">OMTMS Counter</h1>
              <p className="text-xs text-indigo-100">Ticket Booking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Counter Staff</span>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'booking', label: '🎫 New Booking', icon: '🎫' },
            { id: 'bookings', label: '📋 Recent Bookings', icon: '📋' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'booking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded mb-4">
                <h2 className="text-lg font-bold mb-3">Customer Information</h2>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="Customer Name *" value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    className="p-2 border rounded" />
                  <input type="email" placeholder="Email (optional)" value={customerEmail} 
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="p-2 border rounded" />
                  <input type="text" placeholder="Phone (optional)" value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="p-2 border rounded" />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search movies by title or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
              </div>

              <h2 className="text-xl font-bold mb-4">Select Movie</h2>
              {filteredMovies.length === 0 ? (
                <div className="bg-white p-8 rounded text-center">
                  <p className="text-gray-500">No movies found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {filteredMovies.map(m => (
                    <div key={m.movieId} 
                      className={`p-4 rounded shadow cursor-pointer bg-white ${selectedMovie?.movieId === m.movieId ? 'ring-2 ring-indigo-500' : ''}`}
                      onClick={async () => { 
                        setSelectedMovie(m); 
                        setSelectedShow(null); 
                        setSelectedSeats([]);
                        setShowSeats([]);
                      }}>
                      <h3 className="font-bold text-sm truncate">{m.title}</h3>
                      <p className="text-xs text-gray-600">{m.genre} | {m.duration} min</p>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedMovie && (
                <div className="bg-white p-4 rounded mb-4">
                  <h3 className="text-lg font-bold mb-3">Select Show Time</h3>
                  {movieShows.length === 0 ? (
                    <p className="text-gray-500">No shows available</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {movieShows.map(s => (
                        <div key={s.showId} 
                          className={`p-3 border rounded cursor-pointer ${selectedShow?.showId === s.showId ? 'border-indigo-500 bg-indigo-50' : ''}`}
                          onClick={async () => { 
                            setSelectedShow(s); 
                            setSelectedSeats([]);
                            setShowSeats([]);
                            try {
                              const seatsRes = await showService.getShowSeats(s.showId);
                              if (seatsRes.data && seatsRes.data.length > 0) {
                                setShowSeats(seatsRes.data);
                              }
                            } catch (e) {
                              console.log('No seats found');
                            }
                          }}>
                          <p className="font-semibold text-sm">{s.hallName}</p>
                          <p className="text-xs">{s.startTime}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {selectedShow && (
                <div className="bg-white p-3 rounded">
                  <h3 className="text-lg font-bold mb-2">Select Seats</h3>
                  <div className="mb-2 flex gap-3 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span>Balcony</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span>Premium</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span>Ordinary</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span>Selected</span>
                  </div>
                  <div className="bg-gray-300 w-64 h-6 rounded mb-3 flex items-center justify-center text-xs mx-auto">SCREEN</div>
<div className="flex flex-col items-center space-y-1">
                    {getUniqueRows().filter(row => ['A', 'B', 'E', 'F', 'G', 'J', 'K'].includes(row)).map(row => {
                      const maxSeats = getMaxSeatNumber(row);
                      const seat = showSeats.find(s => s.row === row);
                      const tier = seat?.seatType || (row === 'A' || row === 'B' || row === 'C' ? 'Balcony' : row === 'E' || row === 'F' || row === 'G' || row === 'H' ? 'Premium' : 'Ordinary');
                      const price = seat?.price || (tier === 'Balcony' ? 350 : tier === 'Premium' ? 250 : 150);
                      const tierColor = tier === 'Balcony' ? 'bg-purple-500' : tier === 'Premium' ? 'bg-blue-500' : 'bg-green-500';
                      const rowBg = tier === 'Balcony' ? 'bg-purple-100 text-purple-700' : tier === 'Premium' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
                      return (
                        <div key={row} className="flex items-center">
                          <div className={`w-6 h-6 text-xs font-bold rounded flex items-center justify-center flex-shrink-0 ${rowBg}`}>{row}</div>
                          <div className="flex gap-1">
                            {Array.from({ length: maxSeats }, (_, i) => i + 1).map(num => {
                              const seat = showSeats.find(s => s.row === row && s.seatNumber === num.toString());
                              if (!seat) return null;
                              const isSelected = selectedSeats.includes(seat.seatId);
                              return (
                                <button key={num} onClick={() => toggleSeat(seat)} disabled={!seat.isAvailable}
                                  title={`$${seat.price}`}
                                  className={`w-6 h-6 rounded text-[10px] font-bold flex-shrink-0 ${!seat.isAvailable ? 'bg-gray-400 cursor-not-allowed text-white' : isSelected ? 'bg-yellow-500 ring-2 ring-yellow-300 text-black' : `${tierColor} text-white`}`}>
                                  {num}
                                </button>
                              );
                            })}
                          </div>
                          <span className={`ml-2 text-xs font-medium ${rowBg} px-1 rounded`}>${price}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 rounded">
                    <p>Selected: {selectedSeats.length} seats</p>
                    <p className="text-lg font-bold">Total: ${calculateTotal().toFixed(2)}</p>
                  </div>
                  <button onClick={handleBook} disabled={selectedSeats.length === 0 || !customerName}
                    className={`mt-4 w-full py-2 rounded font-bold ${selectedSeats.length === 0 || !customerName ? 'bg-gray-400' : 'bg-indigo-600 text-white'}`}>
                    Process Payment
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded h-fit">
              <h3 className="font-bold mb-2">Booking Summary</h3>
              {selectedMovie ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Customer:</strong> {customerName}</p>
                  <p><strong>Movie:</strong> {selectedMovie.title}</p>
                  {selectedShow && (
                    <>
                      <p><strong>Hall:</strong> {selectedShow.hallName}</p>
                      <p><strong>Time:</strong> {selectedShow.startTime}</p>
                      <p><strong>Seats:</strong> {selectedSeats.length || 'None'}</p>
                      <p className="text-xl font-bold border-t pt-2">Total: ${calculateTotal().toFixed(2)}</p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select a movie</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Today's Bookings</h2>
            <table className="w-full">
              <thead><tr><th>ID</th><th>Movie</th><th>Customer</th><th>Seats</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.slice(0, 20).map(b => <tr key={b.bookingId}><td>{b.bookingId}</td><td>{b.movieName}</td><td>{b.customerName}</td><td>{b.seats?.length || 0}</td><td>${b.totalAmount}</td><td>{b.status}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Payment</h3>
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p><strong>Customer:</strong> {customerName}</p>
              <p><strong>Movie:</strong> {selectedMovie?.title}</p>
              <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
              <p className="text-xl font-bold mt-2">Total: ${finalAmount.toFixed(2)}</p>
            </div>
            <input type="text" placeholder="Card Number" maxLength="16" value={paymentData.cardNumber} 
              onChange={e => setPaymentData({...paymentData, cardNumber: e.target.value})}
              className="w-full p-2 border rounded mb-2" />
            <div className="flex gap-2">
              <input type="text" placeholder="MM/YY" maxLength="5" value={paymentData.expiry} 
                onChange={e => setPaymentData({...paymentData, expiry: e.target.value})}
                className="w-1/2 p-2 border rounded mb-2" />
              <input type="text" placeholder="CVV" maxLength="3" value={paymentData.cvv} 
                onChange={e => setPaymentData({...paymentData, cvv: e.target.value})}
                className="w-1/2 p-2 border rounded mb-2" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={processPayment} disabled={processing}
                className="flex-1 bg-indigo-600 text-white p-2 rounded disabled:bg-gray-400">
                {processing ? 'Processing...' : 'Complete Payment'}
              </button>
              <button onClick={() => setShowPayment(false)} className="flex-1 bg-gray-500 text-white p-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
