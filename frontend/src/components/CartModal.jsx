// components/CartModal.jsx
import React from 'react';

function CartModal({ cartItems, setShowCart, setShowCheckout, updateQuantity, removeFromCart }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutClick = () => {
    console.log('Checkout button clicked in CartModal');
    
    // Method 1: Try to close cart and open checkout directly
    if (setShowCart) {
      setShowCart(false);
      console.log('Cart modal closed');
    }
    
    // Method 2: Use the callback directly
    if (setShowCheckout) {
      setShowCheckout(true);
      console.log('setShowCheckout called directly');
    } else {
      // Method 3: Fallback - use the window function
      console.log('Using window fallback');
      if (window.forceOpenCheckout) {
        window.forceOpenCheckout();
      } else {
        console.error('No checkout function available');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowCart && setShowCart(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowCart && setShowCart(false)}>×</button>
        
        <h2>Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">Rs. {item.price}</p>
                    
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity && updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity && updateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  
                  <button 
                    className="remove-item"
                    onClick={() => removeFromCart && removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-total">
              <span>Total:</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={handleCheckoutClick}
              style={{
                background: '#8B7355',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%',
                marginTop: '1rem'
              }}
            >
              Proceed to Checkout →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartModal;