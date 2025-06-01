// app/admin/orders/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders...");
      
      const response = await axios.get("/api/orders?limit=100");
      console.log("Orders API response:", response.data);
      
      if (response.data.success) {
        const ordersData = response.data.data.orders || [];
        setOrders(ordersData);
        console.log("Orders set:", ordersData.length);
      } else {
        console.error("API returned success: false");
        setMessage("Failed to fetch orders: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage("Error fetching orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log("Updating order:", orderId, "to status:", newStatus);
      
      const response = await axios.patch(`/api/orders/${orderId}`, {
        orderStatus: newStatus
      });
      
      console.log("Update response:", response.data);
      
      if (response.data.success) {
        // Update the order in the list
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
        ));
        
        // Update selected order
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
        
        setMessage(`Order status updated to ${newStatus}`);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to update status: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("Error updating status: " + (error.response?.data?.message || error.message));
    }
  };

  const openModal = (order) => {
    console.log("Opening modal for order:", order);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatPrice = (price) => `Rs. ${price?.toFixed(0) || 0}`;
  
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "#f59e0b",
      processing: "#3b82f6", 
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444"
    };
    return colors[status] || "#6b7280";
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const matchesSearch = 
      (order.customer?.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customer?.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customer?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order._id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading orders...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
          Order Management
        </h1>
        <p style={{ color: '#666' }}>Manage and track all customer orders</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: message.includes('Error') || message.includes('Failed') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') || message.includes('Failed') ? '#dc2626' : '#059669',
          border: '1px solid',
          borderColor: message.includes('Error') || message.includes('Failed') ? '#fecaca' : '#a7f3d0',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      {/* Search and Filter */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '8px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by customer name, email, or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '5px'
          }}
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #d1d5db',
            borderRadius: '5px',
            minWidth: '150px'
          }}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            Orders ({filteredOrders.length})
          </h2>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Items</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px' }}>
                    <code style={{ 
                      fontSize: '0.875rem', 
                      backgroundColor: '#f3f4f6', 
                      padding: '4px 8px', 
                      borderRadius: '4px' 
                    }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </code>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {order.customer.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {order.items.reduce((total, item) => total + item.quantity, 0)} items
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>
                    {formatPrice(order.pricing.total)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: getStatusColor(order.orderStatus) + '20',
                      color: getStatusColor(order.orderStatus),
                      textTransform: 'capitalize'
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                    {formatDate(order.orderDate)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => openModal(order)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                      👁 View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
            <h3 style={{ margin: '0 0 10px 0' }}>No orders found</h3>
            <p style={{ margin: 0 }}>
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "No orders have been placed yet"
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '20px'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '15px'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                {selectedOrder.trackingNumber && (
                  <p style={{ margin: '5px 0 0 0', color: '#3b82f6' }}>
                    Tracking: {selectedOrder.trackingNumber}
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Status Update Section */}
            <div style={{
              backgroundColor: '#eff6ff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1d4ed8' }}>Update Order Status</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(selectedOrder._id, status)}
                    disabled={selectedOrder.orderStatus === status}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedOrder.orderStatus === status ? '#3b82f6' : 'white',
                      color: selectedOrder.orderStatus === status ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      cursor: selectedOrder.orderStatus === status ? 'not-allowed' : 'pointer',
                      textTransform: 'capitalize',
                      opacity: selectedOrder.orderStatus === status ? 0.7 : 1
                    }}
                  >
                    {selectedOrder.orderStatus === status ? '✓ ' : ''}{status}
                  </button>
                ))}
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.875rem', color: '#1d4ed8' }}>
                Current: <strong style={{ textTransform: 'capitalize' }}>{selectedOrder.orderStatus}</strong>
              </p>
            </div>

            {/* Customer Info */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Customer Information</h3>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  <p style={{ margin: '5px 0' }}><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p style={{ margin: '5px 0' }}><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                </div>
              </div>
              
              <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Delivery Address</h3>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  <p style={{ margin: '5px 0' }}>{selectedOrder.address.street}</p>
                  <p style={{ margin: '5px 0' }}>{selectedOrder.address.city}</p>
                  {selectedOrder.address.postalCode && (
                    <p style={{ margin: '5px 0' }}>Postal: {selectedOrder.address.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Order Items</h3>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <img
                      src={item.image || `https://via.placeholder.com/60?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatPrice(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>Order Summary</h3>
              <div style={{ fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.pricing.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Shipping:</span>
                  <span>{selectedOrder.pricing.shipping === 0 ? "Free" : formatPrice(selectedOrder.pricing.shipping)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Tax:</span>
                  <span>{formatPrice(selectedOrder.pricing.tax)}</span>
                </div>
                <hr style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span>{formatPrice(selectedOrder.pricing.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Customer Notes</h3>
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  padding: '10px', 
                  borderRadius: '4px',
                  borderLeft: '4px solid #f59e0b',
                  fontSize: '0.875rem'
                }}>
                  {selectedOrder.notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}