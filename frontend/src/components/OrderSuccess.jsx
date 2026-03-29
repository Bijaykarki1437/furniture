// components/OrderSuccess.jsx
import React from 'react';

function OrderSuccess({ orderNumber, setShowSuccess, setShowCheckout }) {
  return (
    <div className="modal-overlay" onClick={() => {
      setShowSuccess(false);
      setShowCheckout(false);
    }}>
      <div className="modal-content success-modal" onClick={e => e.stopPropagation()}>
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase.</p>
        <p className="order-number">Order #: {orderNumber}</p>
        <p>You will receive a confirmation email shortly.</p>
        <button 
          className="continue-btn"
          onClick={() => {
            setShowSuccess(false);
            setShowCheckout(false);
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;