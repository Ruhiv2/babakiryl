import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import DrawsTab from './DrawsTab';
import WinningNumbersTab from './WinningNumbersTab';
import UsersTab from './UsersTab';
import TicketsTab from './TicketsTab';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('draws');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Admin check - User:', user ? user.id : 'None', 'Role:', user?.user_metadata?.role);
        if (user && user.user_metadata.role === 'admin') {
          setUser(user);
        } else {
          setError('Access denied: Admin only');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log('Signed out');
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-700">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
        <div>
          <a href="/login" className="text-primary-blue underline">Log in</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Adamas Lottery Admin Panel</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      <div className="flex space-x-4 mb-4">
        {['draws', 'winning_numbers', 'users', 'tickets'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-medium ${activeTab === tab ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>
      {activeTab === 'draws' && <DrawsTab />}
      {activeTab === 'winning_numbers' && <WinningNumbersTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'tickets' && <TicketsTab />}
    </div>
  );
}

export default AdminDashboard;