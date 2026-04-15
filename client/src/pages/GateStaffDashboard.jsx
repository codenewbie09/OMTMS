import React, { useState, useEffect } from 'react';
import { movieService, hallService, showService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GateStaffDashboard() {
  const [ticketCode, setTicketCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [scanning, setScanning] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!ticketCode.trim()) return;
    setScanning(true);
    try {
      const response = await bookingService.verifyTicket(ticketCode.trim());
      setScanResult({ ...response.data, success: true });
      setScanHistory(prev => [{ ...response.data, success: true, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setScanResult({ success: false, error: errorMsg });
      setScanHistory(prev => [{ success: false, error: errorMsg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    }
    setTicketCode('');
    setScanning(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleVerify();
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <nav className="px-6 py-4 flex justify-between items-center" style={{ background: 'linear-gradient(90deg, #e94560 0%, #ff6b6b 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>
            🎫
          </div>
          <div>
            <h1 className="text-white text-lg font-semibold">Cinema Gate</h1>
            <p className="text-white/70 text-xs">Ticket Verification System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full text-xs text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>Gate Staff</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.1)' }}>
            Sign Out
          </button>
        </div>
      </nav>
      
      <div className="p-8">
        <div className="max-w-xl mx-auto">
          <div className="rounded-xl p-8 mb-6" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 className="text-white text-2xl font-bold mb-2 text-center">Verify Ticket</h2>
            <p className="text-white/50 text-center mb-6">Enter ticket code or scan QR code at entrance</p>
            
            <div className="flex gap-3">
              <input 
                type="text" 
                value={ticketCode} 
                onChange={e => setTicketCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="TKT-XXXXXXXX" 
                className="flex-1 px-4 py-3 rounded-lg text-white text-center text-lg tracking-widest"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
                autoFocus
              />
              <button 
                onClick={handleVerify} 
                disabled={scanning}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
                style={{ background: scanning ? '#666' : 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)' }}
              >
                {scanning ? 'Checking...' : 'Verify'}
              </button>
            </div>
          </div>
          
          {scanResult && (
            <div className={`rounded-xl p-6 mb-6 ${scanResult.success ? '' : ''}`} 
              style={{ 
                background: scanResult.success ? 'linear-gradient(135deg, #00c853 0%, #69f0ae 100%)' : 'linear-gradient(135deg, #ff5252 0%, #ff1744 100%)',
                boxShadow: scanResult.success ? '0 0 30px rgba(0,200,83,0.4)' : '0 0 30px rgba(255,82,82,0.4)'
              }}>
              {scanResult.success ? (
                <div className="text-center">
                  <div className="text-5xl mb-3">✓</div>
                  <h3 className="text-white text-2xl font-bold mb-4">ADMITTED</h3>
                  <div className="space-y-2 text-white/90">
                    <p className="text-lg font-medium">{scanResult.movieName}</p>
                    <p>{scanResult.hallName} • {scanResult.showTime}</p>
                    <p className="text-sm opacity-80">Seats: {scanResult.seats?.map(s => s.row + s.seatNumber).join(', ')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-3">✕</div>
                  <h3 className="text-white text-2xl font-bold">NOT VALID</h3>
                  <p className="text-white/80 mt-2">{scanResult.error}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Recent Verifications</h3>
            {scanHistory.length === 0 ? (
              <p className="text-white/40">No tickets verified yet</p>
            ) : (
              <div className="space-y-2">
                {scanHistory.map((scan, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg" 
                    style={{ background: scan.success ? 'rgba(0,200,83,0.1)' : 'rgba(255,82,82,0.1)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{scan.success ? '✓' : '✕'}</span>
                      <span className="text-white">{scan.success ? scan.ticketCode : scan.error}</span>
                    </div>
                    <span className="text-white/50 text-sm">{scan.time}</span>
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