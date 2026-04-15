import React, { useState, useEffect } from 'react';
import { movieService, showService, bookingService, hallService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [showSeats, setShowSeats] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [user?.userId]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
const [moviesRes, showsRes, hallsRes] = await Promise.all([
        movieService.getAll(),
        showService.getAll(),
        hallService.getAll()
      ]);
      setMovies(moviesRes.data || []);
      setShows(showsRes.data || []);
      setHalls(hallsRes.data || []);
      
      if (user?.customerId) {
        try {
          const [bookingsRes, loyaltyRes] = await Promise.all([
            bookingService.getByCustomer(user.customerId),
            fetch(`http://localhost:8080/api/customers/${user.customerId}/loyalty`).then(r => r.json()).catch(() => null)
          ]);
          setBookings(bookingsRes.data || []);
          setLoyaltyInfo(loyaltyRes);
        } catch (e) {
          console.log('No bookings yet');
          setBookings([]);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const movieShows = selectedMovie ? shows.filter(s => s.movieId === selectedMovie.movieId) : [];
  
  const filteredMovies = movies.filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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

  const generateMockSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N'];
    const seatCounts = [10, 10, 10, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10]; // D has 0 seats
    
    rows.forEach((row, rowIndex) => {
      const count = seatCounts[rowIndex] || 10;
      for (let i = 1; i <= count; i++) {
        const rowLetter = rowIndex;
        const seatType = rowLetter < 2 ? 'Balcony' : rowLetter < 7 ? 'Premium' : 'Ordinary';
        const price = rowLetter < 2 ? 350 : rowLetter < 7 ? 250 : 150;
        seats.push({
          seatId: rowIndex * 50 + i,
          row: row,
          seatNumber: String(i),
          seatType: seatType,
          category: seatType.toUpperCase(),
          price: price,
          isAvailable: true,
          isBlocked: false
        });
      }
    });
    return seats;
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

  const handleBook = async () => {
    if (!selectedShow || selectedSeats.length === 0) return;
    setShowPayment(true);
  };
  
  const processPayment = async () => {
    // Validate seats are still available
    const unavailableSeats = selectedSeats.filter(seatId => {
      const seat = showSeats.find(s => s.seatId === seatId);
      return !seat || !seat.isAvailable;
    });
    
    if (unavailableSeats.length > 0) {
      alert('Some selected seats are no longer available. Please re-select seats.');
      setSelectedSeats([]);
      setShowPayment(false);
      setProcessing(false);
      return;
    }
    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const bookingData = {
        customerId: user.customerId,
        showId: selectedShow.showId,
        seatIds: selectedSeats,
        paymentMethod: 'CARD',
        paymentStatus: 'SUCCESS'
      };
      console.log('Creating booking with:', bookingData);
      const result = await bookingService.create(bookingData);
      console.log('Booking result:', result);
      alert('Booking successful! Your tickets are confirmed. Ticket Code: ' + result.data.ticketCode);
      setShowPayment(false);
      setSelectedMovie(null);
      setSelectedShow(null);
      setSelectedSeats([]);
      setShowSeats([]);
      loadData();
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel? You will receive 90% refund.')) return;
    try {
      await bookingService.cancel(bookingId, 'Customer requested cancellation');
      alert('Booking cancelled. Refund will be processed.');
      loadData();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading...</div>
          <p className="text-gray-500">Please wait while we fetch movies and shows</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-2xl mb-4">Error</div>
          <p>{error}</p>
          <button onClick={loadData} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">🎬</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">OMTMS Cinema</h1>
              <p className="text-xs text-green-100">Book your perfect show</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Welcome, {user?.role}</p>
              <p className="text-xs text-green-100">Customer Account</p>
            </div>
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'browse', label: '🎬 Browse Movies', icon: '🎬' },
            { id: 'bookings', label: '🎟️ My Bookings', icon: '🎟️' },
            { id: 'loyalty', label: '⭐ Loyalty', icon: '⭐' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search movies by title or genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">Now Showing</h2>
              {filteredMovies.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center shadow-sm">
                  <p className="text-4xl mb-2">🎭</p>
                  <p className="text-gray-500">No movies found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMovies.map(m => (
                    <div key={m.movieId} 
                      className={`p-4 rounded-xl shadow-md cursor-pointer bg-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${selectedMovie?.movieId === m.movieId ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                      onClick={() => { setSelectedMovie(m); setSelectedShow(null); setSelectedSeats([]); setShowSeats([]); }}>
                      <div className="h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg mb-3 flex items-center justify-center text-4xl shadow-inner">
                        {m.genre?.includes('Action') ? '💥' : m.genre?.includes('Drama') ? '🎭' : m.genre?.includes('Comedy') ? '😂' : '🎬'}
                      </div>
                      <h3 className="font-bold text-sm truncate text-gray-800">{m.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">{m.genre}</p>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">⭐ {m.rating}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{m.duration} min</p>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedMovie && (
                <div className="mt-6 bg-white p-4 rounded">
                  <h3 className="text-lg font-bold mb-3">Select Show Time</h3>
                  {movieShows.length === 0 ? (
                    <p className="text-gray-500">No shows available</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {movieShows.map(s => (
                        <div key={s.showId} 
                          className={`p-3 border rounded cursor-pointer ${selectedShow?.showId === s.showId ? 'border-green-500 bg-green-50' : ''}`}
                          onClick={async () => { 
                            setSelectedShow(s); 
                            setSelectedSeats([]);
                            try {
                              const seatsRes = await showService.getShowSeats(s.showId);
                              if (seatsRes.data && seatsRes.data.length > 0) {
                                setShowSeats(seatsRes.data);
                              } else {
                                setShowSeats(generateMockSeats());
                              }
                            } catch (e) {
                              console.log('Using mock seats');
                              setShowSeats(generateMockSeats());
                            }
                          }}>
                          <p className="font-semibold text-sm">{s.hallName}</p>
                          <p className="text-xs">{s.startTime}</p>
                          <p className="text-green-600 font-bold text-sm">${s.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {selectedShow && (
                <div className="bg-white p-3 rounded mt-4">
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
                  <button onClick={handleBook} disabled={selectedSeats.length === 0}
                    className={`mt-4 w-full py-2 rounded font-bold ${selectedSeats.length === 0 ? 'bg-gray-400' : 'bg-green-500 text-white'}`}>
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded h-fit">
              <h3 className="font-bold mb-2">Booking Summary</h3>
              {selectedMovie ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Movie:</strong> {selectedMovie.title}</p>
                  <p><strong>Genre:</strong> {selectedMovie.genre}</p>
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
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b.bookingId} className="border p-4 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{b.movieName}</p>
                        <p className="text-sm">{b.hallName}</p>
                        <p className="text-sm">{b.bookingDate}</p>
                        <p className="text-sm">Ticket: {b.ticketCode}</p>
                        <p className="text-sm">Seats: {b.seats?.map(s => s.row + s.seatNumber).join(', ') || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${b.totalAmount}</p>
                        <span className={`px-2 py-1 rounded text-sm ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                    {b.qrCode && b.status === 'CONFIRMED' && (
                      <div className="mt-3 p-3 bg-gray-100 rounded text-center">
                        <p className="text-sm font-semibold mb-2">Scan QR Code at Entry</p>
                        <img src={`data:image/png;base64,${b.qrCode}`} alt="Ticket QR Code" className="mx-auto w-32 h-32" />
                      </div>
                    )}
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => handleCancel(b.bookingId)} className="mt-2 text-red-500 text-sm">Cancel Booking</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-bold mb-4">My Loyalty Program</h2>
            {loyaltyInfo ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-80">Current Tier</p>
                    <p className="text-2xl font-bold mt-1">{loyaltyInfo.loyaltyTier || 'NONE'}</p>
                    {loyaltyInfo.isLoyaltyMember && (
                      <p className="text-xs mt-2 bg-white/20 inline-block px-2 py-1 rounded">LOYAL MEMBER</p>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-80">Loyalty Points</p>
                    <p className="text-3xl font-bold mt-1">{loyaltyInfo.loyaltyPoints || 0}</p>
                    <p className="text-xs mt-2 opacity-80">1 point per $1 spent</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-lg">
                    <p className="text-sm opacity-80">Total Purchases</p>
                    <p className="text-3xl font-bold mt-1">{loyaltyInfo.purchaseCount || 0}</p>
                    <p className="text-xs mt-2 opacity-80">Total spent: ${loyaltyInfo.totalSpent?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-bold mb-3">Discount Tiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className={`p-3 rounded border ${loyaltyInfo.loyaltyPoints >= 500 ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Platinum</p>
                      <p className="text-sm text-gray-600">500+ points</p>
                      <p className="text-green-600 font-bold mt-1">15% Discount</p>
                    </div>
                    <div className={`p-3 rounded border ${loyaltyInfo.loyaltyPoints >= 200 && loyaltyInfo.loyaltyPoints < 500 ? 'bg-gray-200 border-gray-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Gold</p>
                      <p className="text-sm text-gray-600">200+ points</p>
                      <p className="text-green-600 font-bold mt-1">10% Discount</p>
                    </div>
                    <div className={`p-3 rounded border ${loyaltyInfo.loyaltyPoints >= 100 && loyaltyInfo.loyaltyPoints < 200 ? 'bg-gray-200 border-gray-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Silver</p>
                      <p className="text-sm text-gray-600">100+ points</p>
                      <p className="text-green-600 font-bold mt-1">5% Discount</p>
                    </div>
                    <div className={`p-3 rounded border ${loyaltyInfo.loyaltyPoints > 0 && loyaltyInfo.loyaltyPoints < 100 ? 'bg-gray-200 border-gray-400' : 'bg-gray-50'}`}>
                      <p className="font-semibold">Basic</p>
                      <p className="text-sm text-gray-600">0+ points</p>
                      <p className="text-gray-500 mt-1">Member</p>
                    </div>
                  </div>
                </div>

                {loyaltyInfo.pointsToNextTier > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-800">
                      {loyaltyInfo.pointsToNextTier} more points to reach {loyaltyInfo.nextTier}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, ((loyaltyInfo.loyaltyPoints || 0) / (loyaltyInfo.loyaltyPoints + loyaltyInfo.pointsToNextTier)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <h3 className="font-bold mb-3">Bulk Discount</h3>
                  <p className="text-gray-600">Book 5 or more seats and get an additional <span className="font-bold text-green-600">10% OFF</span> on your booking!</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Your Loyalty ID</h3>
                  {loyaltyInfo.loyaltyId ? (
                    <p className="font-mono text-lg bg-white px-3 py-2 rounded border">{loyaltyInfo.loyaltyId}</p>
                  ) : (
                    <p className="text-gray-500">Make 3 purchases to become a loyalty member and get your ID!</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading loyalty info...</p>
            )}
          </div>
        )}
      </div>
      
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Payment</h3>
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p><strong>Movie:</strong> {selectedMovie?.title}</p>
              <p><strong>Show:</strong> {selectedShow?.startTime}</p>
              <p><strong>Seats:</strong> {selectedSeats.length} seats</p>
              <p className="text-xl font-bold mt-2">Total: ${calculateTotal().toFixed(2)}</p>
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
                className="flex-1 bg-green-500 text-white p-2 rounded disabled:bg-gray-400">
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
              <button onClick={() => setShowPayment(false)} className="flex-1 bg-gray-500 text-white p-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
