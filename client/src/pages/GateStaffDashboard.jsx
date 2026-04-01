import React, { useState } from 'react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GateStaffDashboard() {
  const [ticketCode, setTicketCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!ticketCode.trim()) return;
    try {
      const response = await bookingService.verifyTicket(ticketCode.trim());
      const result = { ...response.data, scannedAt: new Date().toLocaleTimeString(), success: true };
      setScanResult(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10));
    } catch (err) {
      const result = { error: err.response?.data?.message || err.message, scannedAt: new Date().toLocaleTimeString(), success: false };
      setScanResult(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10));
    }
    setTicketCode('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-orange-600 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">OMTMS - Gate Staff</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Gate Staff Mode</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 px-4 py-1 rounded">Logout</button>
        </div>
      </nav>
      
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Ticket Verification</h2>
            <p className="text-gray-400 text-center mb-4">Enter ticket code or scan QR code</p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={ticketCode} 
                onChange={e => setTicketCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter ticket code (e.g., TKT-ABC12345)" 
                className="flex-1 p-4 border rounded bg-gray-700 border-gray-600 text-white text-lg text-center tracking-wider"
                autoFocus
              />
              <button onClick={handleVerify} className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded font-bold">
                Verify
              </button>
            </div>
          </div>
          
          {scanResult && (
            <div className={`rounded-lg p-6 mb-6 ${scanResult.success ? 'bg-green-600' : 'bg-red-600'}`}>
              {scanResult.success ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">✓</div>
                  <h3 className="text-2xl font-bold">TICKET VALID</h3>
                  <div className="mt-4 space-y-1">
                    <p><strong>Movie:</strong> {scanResult.movieName}</p>
                    <p><strong>Theater:</strong> {scanResult.theaterName}</p>
                    <p><strong>Time:</strong> {scanResult.showTime}</p>
                    <p><strong>Seats:</strong> {scanResult.seats?.map(s => s.row + s.seatNumber).join(', ')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-2">✗</div>
                  <h3 className="text-2xl font-bold">TICKET INVALID</h3>
                  <p className="mt-2">{scanResult.error}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Recent Scans</h3>
            {scanHistory.length === 0 ? (
              <p className="text-gray-400">No scans yet</p>
            ) : (
              <div className="space-y-2">
                {scanHistory.map((scan, index) => (
                  <div key={index} className={`flex justify-between items-center p-3 rounded ${scan.success ? 'bg-green-800' : 'bg-red-800'}`}>
                    <span>{scan.ticketCode || scan.error}</span>
                    <span className="text-sm">{scan.scannedAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
