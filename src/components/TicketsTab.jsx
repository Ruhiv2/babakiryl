import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function TicketsTab() {
  const [tickets, setTickets] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ticket_number: '', draw_date: '', status: 'active', source: 'Manual' });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => new Date(date).toISOString().split('T')[0];

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, users(email)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      console.log('Fetched tickets:', data);
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setFormError('Error fetching tickets: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleEdit = (ticket) => {
    setEditingId(ticket.id);
    setFormData({
      ticket_number: ticket.ticket_number,
      draw_date: formatDate(ticket.draw_date),
      status: ticket.status,
      source: ticket.source,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          ticket_number: formData.ticket_number,
          draw_date: formData.draw_date,
          status: formData.status,
          source: formData.source,
        })
        .eq('id', editingId);
      if (error) throw error;
      console.log('Ticket updated:', editingId);
      alert('Ticket updated successfully');
      setEditingId(null);
      setFormData({ ticket_number: '', draw_date: '', status: 'active', source: 'Manual' });
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      setFormError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const { error } = await supabase.from('tickets').delete().eq('id', id);
        if (error) throw error;
        console.log('Ticket deleted:', id);
        alert('Ticket deleted successfully');
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        alert('Error deleting ticket: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-4 text-gray-700">Loading tickets...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Tickets</h2>
      {editingId && (
        <form onSubmit={handleUpdate} className="mb-6 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Ticket Number</label>
            <input
              type="text"
              value={formData.ticket_number}
              onChange={(e) => setFormData({ ...formData, ticket_number: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Draw Date</label>
            <input
              type="date"
              value={formData.draw_date}
              onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="winner">Winner</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="SMS">SMS</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          {formError && <p className="text-red-500 mb-4">{formError}</p>}
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
            Update Ticket
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-gray-700 font-medium">ID</th>
              <th className="p-3 text-left text-gray-700 font-medium">User Email</th>
              <th className="p-3 text-left text-gray-700 font-medium">Ticket Number</th>
              <th className="p-3 text-left text-gray-700 font-medium">Draw Date</th>
              <th className="p-3 text-left text-gray-700 font-medium">Status</th>
              <th className="p-3 text-left text-gray-700 font-medium">Source</th>
              <th className="p-3 text-left text-gray-700 font-medium">Prize (ETB)</th>
              <th className="p-3 text-left text-gray-700 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-gray-900">{ticket.id}</td>
                <td className="p-3 text-gray-900">{ticket.users.email}</td>
                <td className="p-3 text-gray-900 font-mono">{ticket.ticket_number}</td>
                <td className="p-3 text-gray-900">{formatDate(ticket.draw_date)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'active' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'winner' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-3 text-gray-900">{ticket.source}</td>
                <td className="p-3 text-gray-900">{ticket.prize_amount ? ticket.prize_amount.toLocaleString() : '0'} ETB</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600 transition duration-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketsTab;