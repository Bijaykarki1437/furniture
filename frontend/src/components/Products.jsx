import React, { useState, useEffect } from 'react';

const productsData = [
  {
    id: 1,
    name: 'Modern Sofa',
    price: 999,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'sofa',
    description: 'Elegant modern sofa with premium fabric and comfortable cushioning. Perfect for contemporary living rooms.'
  },
  {
    id: 2,
    name: 'Dining Table',
    price: 799,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'table',
    description: 'Solid wood dining table with modern design. Seats up to 6 people comfortably.'
  },
  {
    id: 3,
    name: 'Armchair',
    price: 399,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'chair',
    description: 'Comfortable armchair with ergonomic design and premium upholstery.'
  },
  {
    id: 4,
    name: 'Bed Frame',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'bed',
    description: 'Luxury bed frame with upholstered headboard and solid wood construction.'
  },
  {
    id: 5,
    name: 'Bookshelf',
    price: 599,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'storage',
    description: 'Modern bookshelf with adjustable shelves and sturdy construction.'
  },
  {
    id: 6,
    name: 'Coffee Table',
    price: 349,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'table',
    description: 'Minimalist coffee table with tempered glass top and metal legs.'
  }
];

function Products({ addToCart, setShowQuickView, searchQuery }) {
  const [filteredProducts, setFilteredProducts] = useState(productsData);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    let result = [...productsData];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(product => product.category === filter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filter, sortBy, searchQuery]);

  const categories = ['all', 'sofa', 'table', 'chair', 'bed', 'storage'];

  return (
    <section className="products-section">
      <h2 className="section-title">Our Products</h2>
      
      <div className="filters">
        <div className="filter-group">
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            addToCart={addToCart}
            setShowQuickView={setShowQuickView}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, addToCart, setShowQuickView }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <button 
          className="quick-view-btn"
          onClick={() => setShowQuickView(product)}
        >
          Quick View
        </button>
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">Rs. {product.price}</p>
        
        <div className="product-actions">
          <div className="quantity-control">
            <button 
              className="quantity-btn"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              +
            </button>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                addToCart(product);
              }
              setQuantity(1);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;