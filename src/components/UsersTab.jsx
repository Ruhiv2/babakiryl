import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => new Date(date).toISOString().split('T')[0];

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      console.log('Fetched users:', data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center mt-4 text-gray-700">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-gray-700 font-medium">ID</th>
              <th className="p-3 text-left text-gray-700 font-medium">Email</th>
              <th className="p-3 text-left text-gray-700 font-medium">Full Name</th>
              <th className="p-3 text-left text-gray-700 font-medium">Phone Number</th>
              <th className="p-3 text-left text-gray-700 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-gray-900">{user.id}</td>
                <td className="p-3 text-gray-900">{user.email}</td>
                <td className="p-3 text-gray-900">{user.full_name}</td>
                <td className="p-3 text-gray-900">{user.phone_number || 'N/A'}</td>
                <td className="p-3 text-gray-900">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTab;