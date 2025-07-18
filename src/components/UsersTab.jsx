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
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left text-gray-700">ID</th>
              <th className="p-2 text-left text-gray-700">Email</th>
              <th className="p-2 text-left text-gray-700">Full Name</th>
              <th className="p-2 text-left text-gray-700">Phone Number</th>
              <th className="p-2 text-left text-gray-700">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.full_name}</td>
                <td className="p-2">{user.phone_number || 'N/A'}</td>
                <td className="p-2">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTab;