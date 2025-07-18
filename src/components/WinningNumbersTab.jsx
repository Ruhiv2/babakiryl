import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function WinningNumbersTab() {
  const [winningNumbers, setWinningNumbers] = useState([]);
  const [formData, setFormData] = useState({
    draw_date: '',
    winning_number: '',
    position: '',
    prize_amount: '',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWinningNumbers = async () => {
    try {
      const { data, error } = await supabase
        .from('winning_numbers')
        .select('id, draw_date, winning_number, position, prize_amount, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      console.log('Fetched winning numbers:', data);
      setWinningNumbers(data);
    } catch (error) {
      console.error('Error fetching winning numbers:', error);
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinningNumbers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.winning_number.match(/^\d{3}-\d{7}$/)) {
      setFormError('Winning number must be in format XXX-YYYYYYY (e.g., 212-1212121)');
      return;
    }
    if (!formData.position.match(/^[1-9]$|^10$/)) {
      setFormError('Position must be between 1 and 10');
      return;
    }
    try {
      const { error } = await supabase
        .from('winning_numbers')
        .insert([{
          draw_date: formData.draw_date,
          winning_number: formData.winning_number,
          position: parseInt(formData.position),
          prize_amount: parseFloat(formData.prize_amount),
        }]);
      if (error) throw error;
      console.log('Winning number created:', formData);
      alert('Winning number created successfully');
      setFormData({ draw_date: '', winning_number: '', position: '', prize_amount: '' });
      fetchWinningNumbers();
    } catch (error) {
      console.error('Error submitting winning number:', error);
      setFormError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Winning Numbers</h2>
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
            <label className="block text-gray-700 font-medium mb-2">Winning Number (XXX-YYYYYYY)</label>
            <input
              type="text"
              value={formData.winning_number}
              onChange={(e) => setFormData({ ...formData, winning_number: e.target.value })}
              placeholder="e.g., 212-1212121"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Position (1-10)</label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              min="1"
              max="10"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Prize Amount</label>
            <input
              type="number"
              value={formData.prize_amount}
              onChange={(e) => setFormData({ ...formData, prize_amount: e.target.value })}
              step="0.01"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        {formError && (
          <p className="text-red-500 mt-2 text-sm">{formError}</p>
        )}
        <button
          type="submit"
          className="mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Add Winning Number
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
                <th className="p-3 text-left text-gray-700 font-medium">Winning Number</th>
                <th className="p-3 text-left text-gray-700 font-medium">Position</th>
                <th className="p-3 text-left text-gray-700 font-medium">Prize Amount</th>
                <th className="p-3 text-left text-gray-700 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody>
              {winningNumbers.map((wn) => (
                <tr key={wn.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-900">{wn.id}</td>
                  <td className="p-3 text-gray-900">{wn.draw_date}</td>
                  <td className="p-3 text-gray-900 font-mono">{wn.winning_number}</td>
                  <td className="p-3 text-gray-900">{wn.position}</td>
                  <td className="p-3 text-gray-900">{wn.prize_amount}</td>
                  <td className="p-3 text-gray-900">{new Date(wn.created_at).toISOString().split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WinningNumbersTab;