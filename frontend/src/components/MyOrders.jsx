// components/MyOrders.jsx - UPDATED with proper navigation
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyOrders.css';

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'pending_verification': return '#e74c3c';
      case 'verified': return '#27ae60';
      case 'completed': return '#27ae60';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleStartShopping = () => {
    navigate('/');
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="my-orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <div className="header-left">
          <button 
            className="back-to-shop-btn"
            onClick={handleBackToShopping}
          >
            ← Back to Shopping
          </button>
          <h1>My Orders</h1>
        </div>
        <div className="orders-filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={filter === 'processing' ? 'active' : ''} 
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button 
            className={filter === 'shipped' ? 'active' : ''} 
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button 
            className={filter === 'delivered' ? 'active' : ''} 
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No orders yet</h2>
          <p>When you place an order, it will appear here</p>
          <button className="shop-now-btn" onClick={handleStartShopping}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-info-left">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="order-status-badges">
                  <span 
                    className="status-badge" 
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <span 
                    className="payment-badge" 
                    style={{ background: getPaymentStatusColor(order.paymentStatus) }}
                  >
                    {order.paymentStatus === 'pending_verification' ? 'Pending Verification' : order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-card-content">
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="order-item-preview">
                      <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-meta">Qty: {item.quantity} × Rs. {item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-summary">
                  <div className="order-total">
                    <span>Total Amount:</span>
                    <strong>Rs. {order.total.toFixed(2)}</strong>
                  </div>
                  <div className="payment-method">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'eSewa'}</span>
                  </div>
                  <div className="delivery-address">
                    <span>Delivery Address:</span>
                    <p>{order.address?.tole}, {order.address?.municipality}-{order.address?.wardNo}, {order.address?.district}, {order.address?.province}</p>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <button 
                  className="view-details-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
                {order.status === 'delivered' && (
                  <button className="review-btn">Write a Review</button>
                )}
                {order.status === 'pending' && (
                  <button className="cancel-btn">Cancel Order</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className="order-modal-content">
              <div className="order-info-section">
                <h3>Order Information</h3>
                <div className="info-grid">
                  <div>
                    <label>Order ID:</label>
                    <p>{selectedOrder._id}</p>
                  </div>
                  <div>
                    <label>Order Date:</label>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label>Order Status:</label>
                    <p style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status.toUpperCase()}</p>
                  </div>
                  <div>
                    <label>Payment Status:</label>
                    <p style={{ color: getPaymentStatusColor(selectedOrder.paymentStatus) }}>
                      {selectedOrder.paymentStatus === 'pending_verification' ? 'Pending Verification' : selectedOrder.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="items-section">
                <h3>Items Ordered</h3>
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="item-info">
                              <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td>Rs. {item.price}</td>
                          <td>{item.quantity}</td>
                          <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Subtotal:</strong></td>
                        <td><strong>Rs. {(selectedOrder.total - 100).toFixed(2)}</strong></td>
                      </tr>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Delivery Charge:</strong></td>
                        <td><strong>Rs. 100.00</strong></td>
                      </tr>
                      <tr className="grand-total-row">
                        <td colSpan="3" className="text-right"><strong>Grand Total:</strong></td>
                        <td><strong>Rs. {selectedOrder.total.toFixed(2)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="address-section">
                <h3>Delivery Address</h3>
                <div className="address-card">
                  <p><strong>{selectedOrder.address?.fullName}</strong></p>
                  <p>{selectedOrder.address?.phone}</p>
                  <p>{selectedOrder.address?.email}</p>
                  <p>{selectedOrder.address?.tole}, {selectedOrder.address?.municipality}-{selectedOrder.address?.wardNo}</p>
                  <p>{selectedOrder.address?.district}, {selectedOrder.address?.province}</p>
                  {selectedOrder.address?.deliveryNote && (
                    <p className="delivery-note"><strong>Note:</strong> {selectedOrder.address.deliveryNote}</p>
                  )}
                </div>
              </div>

              {selectedOrder.transactionCode && (
                <div className="payment-section">
                  <h3>Payment Details</h3>
                  <div className="payment-details">
                    <p><strong>Transaction Code:</strong> {selectedOrder.transactionCode}</p>
                    {selectedOrder.transactionImage && (
                      <div className="payment-screenshot">
                        <p><strong>Payment Screenshot:</strong></p>
                        <img 
                          src={selectedOrder.transactionImage} 
                          alt="Payment Proof" 
                          onClick={() => window.open(selectedOrder.transactionImage, '_blank')}
                          style={{ cursor: 'pointer', maxWidth: '200px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;