// src/components/DrawsTab.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function DrawsTab() {
  const [draws, setDraws] = useState([]);
  const [formData, setFormData] = useState({
    draw_date: '',
    jackpot_amount: '',
    status: 'upcoming',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDraws = async () => {
    try {
      const { data, error } = await supabase
        .from('draws')
        .select('id, draw_date, jackpot_amount, status, created_at')
        .order('draw_date', { ascending: false });
      if (error) throw error;
      console.log('Fetched draws:', data);
      setDraws(data);
    } catch (error) {
      console.error('Error fetching draws:', error);
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const { error } = await supabase
        .from('draws')
        .insert([{
          draw_date: formData.draw_date,
          jackpot_amount: parseFloat(formData.jackpot_amount),
          status: formData.status,
        }]);
      if (error) throw error;
      console.log('Draw created:', formData);
      alert('Draw created successfully');
      setFormData({ draw_date: '', jackpot_amount: '', status: 'upcoming' });
      fetchDraws();
    } catch (error) {
      console.error('Error submitting draw:', error);
      setFormError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Draws</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Draw Date</label>
            <input
              type="date"
              value={formData.draw_date}
              onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Jackpot Amount</label>
            <input
              type="number"
              value={formData.jackpot_amount}
              onChange={(e) => setFormData({ ...formData, jackpot_amount: e.target.value })}
              step="0.01"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        {formError && (
          <p className="text-red-500 mt-2 text-sm">{formError}</p>
        )}
        <button
          type="submit"
          className="mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Draw
        </button>
      </form>
      {loading ? (
        <p className="text-center mt-6 text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-gray-700 font-medium">ID</th>
                <th className="p-3 text-left text-gray-700 font-medium">Draw Date</th>
                <th className="p-3 text-left text-gray-700 font-medium">Jackpot Amount</th>
                <th className="p-3 text-left text-gray-700 font-medium">Status</th>
                <th className="p-3 text-left text-gray-700 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-900">{draw.id}</td>
                  <td className="p-3 text-gray-900">{draw.draw_date}</td>
                  <td className="p-3 text-gray-900">{draw.jackpot_amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      draw.status === 'active' ? 'bg-green-100 text-green-800' :
                      draw.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {draw.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-900">{new Date(draw.created_at).toISOString().split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DrawsTab;

