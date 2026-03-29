// components/Collection.js
import React from 'react';

function Collection() {
  const collections = [
    {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      items: 24
    },
    {
      name: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      items: 18
    },
    {
      name: 'Dining',
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      items: 15
    }
  ];

  return (
    <section className="collection-section">
      <h2 className="section-title">Shop by Collection</h2>
      
      <div className="collection-grid">
        {collections.map((collection, index) => (
          <div key={index} className="collection-item">
            <img src={collection.image} alt={collection.name} />
            <div className="collection-overlay">
              <h3>{collection.name}</h3>
              <p>{collection.items} items</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Collection;