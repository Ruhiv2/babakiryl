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
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Manage Draws</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-text-primary mb-2">Draw Date</label>
            <input
              type="date"
              value={formData.draw_date}
              onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
              required
              className="w-full p-2 border border-border-gray rounded focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-text-primary mb-2">Jackpot Amount</label>
            <input
              type="number"
              value={formData.jackpot_amount}
              onChange={(e) => setFormData({ ...formData, jackpot_amount: e.target.value })}
              step="0.01"
              required
              className="w-full p-2 border border-border-gray rounded focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-text-primary mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
              className="w-full p-2 border border-border-gray rounded focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        {formError && (
          <p className="text-error-red mt-2 text-sm">{formError}</p>
        )}
        <button
          type="submit"
          className="mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Add Draw
        </button>
      </form>
      {loading ? (
        <p className="text-center mt-6 text-text-primary">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-text-primary">ID</th>
                <th className="p-3 text-text-primary">Draw Date</th>
                <th className="p-3 text-text-primary">Jackpot Amount</th>
                <th className="p-3 text-text-primary">Status</th>
                <th className="p-3 text-text-primary">Created At</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw) => (
                <tr key={draw.id} className="hover:bg-gray-50">
                  <td className="p-3">{draw.id}</td>
                  <td className="p-3">{draw.draw_date}</td>
                  <td className="p-3">{draw.jackpot_amount}</td>
                  <td className="p-3">{draw.status}</td>
                  <td className="p-3">{new Date(draw.created_at).toISOString().split('T')[0]}</td>
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

