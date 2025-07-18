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
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Tickets</h2>
      {editingId && (
        <form onSubmit={handleUpdate} className="mb-6 bg-white p-6 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Ticket Number</label>
            <input
              type="text"
              value={formData.ticket_number}
              onChange={(e) => setFormData({ ...formData, ticket_number: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Draw Date</label>
            <input
              type="date"
              value={formData.draw_date}
              onChange={(e) => setFormData({ ...formData, draw_date: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-blue"
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="SMS">SMS</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          {formError && <p className="text-red-500 mb-4">{formError}</p>}
          <button type="submit" className="bg-primary-blue text-white px-4 py-2 rounded hover:bg-blue-600">
            Update Ticket
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left text-gray-700">ID</th>
              <th className="p-2 text-left text-gray-700">User Email</th>
              <th className="p-2 text-left text-gray-700">Ticket Number</th>
              <th className="p-2 text-left text-gray-700">Draw Date</th>
              <th className="p-2 text-left text-gray-700">Status</th>
              <th className="p-2 text-left text-gray-700">Source</th>
              <th className="p-2 text-left text-gray-700">Prize (ETB)</th>
              <th className="p-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-t">
                <td className="p-2">{ticket.id}</td>
                <td className="p-2">{ticket.users.email}</td>
                <td className="p-2">{ticket.ticket_number}</td>
                <td className="p-2">{formatDate(ticket.draw_date)}</td>
                <td className="p-2">{ticket.status}</td>
                <td className="p-2">{ticket.source}</td>
                <td className="p-2">{ticket.prize_amount ? ticket.prize_amount.toLocaleString() : '0'} ETB</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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