import { useState, useEffect } from 'react';
import api from '../api/axios';
import Table from '../components/Table';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      alert('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
    }
  };

  const columns = [
    { header: 'Order #', accessor: 'orderNumber' },
    { header: 'Customer', accessor: 'customerName' },
    { header: 'Email', accessor: 'customerEmail' },
    { header: 'Total', render: (row) => `$${row.total}` },
    {
      header: 'Status',
      render: (row) => {
        const statusColors = {
          pending: 'bg-yellow-200 text-yellow-800',
          processing: 'bg-blue-200 text-blue-800',
          shipped: 'bg-purple-200 text-purple-800',
          delivered: 'bg-green-200 text-green-800',
          cancelled: 'bg-red-200 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded text-xs ${statusColors[row.status]}`}>
            {row.status.toUpperCase()}
          </span>
        );
      }
    },
    {
      header: 'Payment',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {row.paymentStatus.toUpperCase()}
        </span>
      )
    },
    {
      header: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">🛒</span> Orders Management
        </h1>
        <p className="text-gray-600 mt-2">View and manage customer orders</p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table
          columns={columns}
          data={orders}
          actions={(row) => (
            <select
              value={row.status}
              onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pending">⏳ Pending</option>
              <option value="processing">⚙️ Processing</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">✅ Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          )}
        />
      </div>
    </div>
  );
};

export default Orders;
