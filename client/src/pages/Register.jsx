import React, { useState } from 'react';
import { authService, movieService, theaterService, showService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '', role: 'CUSTOMER' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.register(formData);
      login(data);
      navigate(data.role === 'ADMIN' ? '/admin' : '/customer');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
          <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
          <input type="text" placeholder="Phone" onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-2 mb-4 border rounded" />
          <input type="text" placeholder="Address" onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-2 mb-4 border rounded" />
          <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-2 mb-4 border rounded" required />
          <select onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-2 mb-4 border rounded">
            <option value="CUSTOMER">Customer</option>
            <option value="SHOWMANAGER">Show Manager</option>
            <option value="COUNTER_STAFF">Counter Staff</option>
            <option value="GATESTAFF">Gate Staff</option>
            <option value="ADMIN">Administrator</option>
          </select>
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
        </form>
        <p className="mt-4 text-center">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
      </div>
    </div>
  );
}
