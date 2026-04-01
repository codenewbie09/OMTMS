import React, { useState, useEffect } from 'react';
import { movieService, showService, bookingService, theaterService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CounterStaffDashboard() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeTab, setActiveTab] = useState('booking');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setMovies((await movieService.getAll()).data);
    setShows((await showService.getAll()).data);
    setTheaters((await theaterService.getAll()).data);
    setBookings((await bookingService.getAll()).data);
  };

  const movieShows = selectedMovie ? shows.filter(s => s.movieId === selectedMovie.movieId) : [];
  const totalAmount = selectedSeats.length * (selectedShow?.price || 0);
  const discount = selectedSeats.length >= 5 ? totalAmount * 0.10 : 0;
  const finalAmount = totalAmount - discount;

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seats = [];
    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= 10; i++) {
        const category = rowIndex <= 1 ? 'BALCONY' : rowIndex <= 3 ? 'PREMIUM' : 'ORDINARY';
        const basePrice = category === 'BALCONY' ? 350 : category === 'PREMIUM' ? 250 : 150;
        seats.push({
          id: `${row}${i}`,
          row: row,
          seatNumber: i,
          category: category,
          price: basePrice,
          booked: Math.random() < 0.3,
          blocked: false
        });
      }
    });
    return seats;
  };

  const availableSeats = selectedShow ? generateSeats() : [];

  const toggleSeat = (seat) => {
    if (seat.booked || seat.blocked) return;
    setSelectedSeats(prev => 
      prev.includes(seat.id) 
        ? prev.filter(s => s !== seat.id)
        : [...prev, seat.id]
    );
  };

  const handleBook = async () => {
    if (!selectedShow || selectedSeats.length === 0 || !customerName) {
      alert('Please select seats and enter customer name');
      return;
    }
    setShowPayment(true);
  };

  const processPayment = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Booking successful! Ticket generated.');
      setShowPayment(false);
      setSelectedMovie(null);
      setSelectedShow(null);
      setSelectedSeats([]);
      setCustomerName('');
      setCustomerPhone('');
      loadData();
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">OMTMS - Counter Staff</h1>
        <div className="flex gap-4 items-center">
          <span>Counter Booking</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
        </div>
      </nav>
      
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          {['booking', 'bookings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
              {tab === 'booking' ? 'New Booking' : 'Recent Bookings'}
            </button>
          ))}
        </div>

        {activeTab === 'booking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded mb-4">
                <h2 className="text-lg font-bold mb-3">Customer Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Customer Name *" value={customerName} 
                    onChange={e => setCustomerName(e.target.value)}
                    className="p-2 border rounded" />
                  <input type="text" placeholder="Phone (optional)" value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="p-2 border rounded" />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Select Movie</h2>
              {movies.length === 0 ? (
                <div className="bg-white p-8 rounded text-center">
                  <p className="text-gray-500">No movies available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {movies.map(m => (
                    <div key={m.movieId} 
                      className={`p-4 rounded shadow cursor-pointer bg-white ${selectedMovie?.movieId === m.movieId ? 'ring-2 ring-indigo-500' : ''}`}
                      onClick={() => { setSelectedMovie(m); setSelectedShow(null); setSelectedSeats([]); }}>
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
                          onClick={() => { setSelectedShow(s); setSelectedSeats([]); }}>
                          <p className="font-semibold text-sm">{s.theaterName}</p>
                          <p className="text-xs">{s.startTime}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {selectedShow && (
                <div className="bg-white p-4 rounded">
                  <h3 className="text-lg font-bold mb-4">Select Seats</h3>
                  <div className="mb-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-green-500 rounded"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-yellow-500 rounded"></div> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-gray-400 rounded"></div> Booked</div>
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-red-500 rounded"></div> Blocked</div>
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-purple-500 rounded"></div> Balcony</div>
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-blue-500 rounded"></div> Premium</div>
                    <div className="flex items-center gap-2"><div className="w-5 h-5 bg-orange-500 rounded"></div> Ordinary</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-gray-300 w-3/4 h-6 rounded mb-3 flex items-center justify-center text-xs">SCREEN</div>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(row => (
                      <div key={row} className="flex gap-1">
                        <span className="w-5 text-xs flex items-center">{row}</span>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => {
                          const seat = availableSeats.find(s => s.row === row && s.seatNumber === num);
                          if (!seat) return <div key={num} className="w-7 h-7"></div>;
                          const isSelected = selectedSeats.includes(seat.id);
                          const catColor = seat.category === 'BALCONY' ? 'bg-purple-500' : seat.category === 'PREMIUM' ? 'bg-blue-500' : 'bg-orange-500';
                          return (
                            <button key={num} onClick={() => toggleSeat(seat)} disabled={seat.booked || seat.blocked}
                              className={`w-7 h-7 rounded text-xs ${seat.blocked ? 'bg-red-500 cursor-not-allowed' : seat.booked ? 'bg-gray-400 cursor-not-allowed' : 
                                isSelected ? 'bg-yellow-500 text-white' : `${catColor} text-white`}`}>
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gray-100 rounded">
                    <p>Selected: {selectedSeats.length} seats</p>
                    {discount > 0 && <p className="text-green-600">Bulk Discount (10%): -${discount.toFixed(2)}</p>}
                    <p className="text-lg font-bold">Total: ${finalAmount.toFixed(2)}</p>
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
                      <p><strong>Theater:</strong> {selectedShow.theaterName}</p>
                      <p><strong>Time:</strong> {selectedShow.startTime}</p>
                      <p><strong>Seats:</strong> {selectedSeats.length || 'None'}</p>
                      <p className="text-xl font-bold border-t pt-2">Total: ${finalAmount.toFixed(2)}</p>
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
