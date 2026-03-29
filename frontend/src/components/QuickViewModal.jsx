import React, { useState } from 'react';

function QuickViewModal({ product, setShowQuickView, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowQuickView(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowQuickView(null)}>×</button>
        
        <div className="modal-product">
          <img src={product.image} alt={product.name} />
          
          <h2>{product.name}</h2>
          <p className="modal-price">Rs. {product.price}</p>
          <p className="modal-description">{product.description}</p>
          
          <div className="modal-actions">
            <div className="modal-quantity">
              <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
            </div>
            
            <button 
              className="modal-add-btn"
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart(product);
                }
                setShowQuickView(null);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;