// App.jsx - UPDATED with cart persistence
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Collection from './components/Collection';
import About from './components/About';
import Contact from './components/Contact';
import CartModal from './components/CartModal';
import QuickViewModal from './components/QuickViewModal';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import MyOrders from './components/MyOrders';
import { AuthProvider, useAuth } from './context/AuthContext';

// Cart key for localStorage
const CART_STORAGE_KEY = 'furniture_cart';

// Main App Content Component (Home page)
function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showQuickView, setShowQuickView] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const heroRef = useRef(null);
  const productsRef = useRef(null);
  const collectionRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  // Get user from auth context
  const { user } = useAuth();

  // Check if user is admin using role field
  const isAdmin = user?.role === 'admin';

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log('Saved cart to localStorage:', cartItems);
    } else {
      // If cart is empty, remove from localStorage to keep it clean
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cartItems]);

  // Handle navigation from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#orders' && user) {
      navigate('/orders');
      window.location.hash = '';
    } else if (hash === '#admin' && isAdmin) {
      setShowAdmin(true);
      window.location.hash = '';
    }
  }, [user, isAdmin, navigate]);

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('==================== CART DEBUG ====================');
      console.log('Cart items:', cartItems);
      console.log('Cart total items:', cartItems.reduce((sum, item) => sum + item.quantity, 0));
      console.log('==================================================');
    }
  }, [cartItems]);

  // Create stable callbacks
  const handleOpenCheckout = useCallback(() => {
    console.log('Opening checkout via callback');
    setShowCheckout(true);
  }, []);

  const handleCloseCart = useCallback(() => {
    console.log('Closing cart via callback');
    setShowCart(false);
  }, []);

  const scrollToSection = (section) => {
    // If on orders page, navigate home first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const refs = {
          hero: heroRef,
          products: productsRef,
          collection: collectionRef,
          about: aboutRef,
          contact: contactRef
        };
        refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const refs = {
        hero: heroRef,
        products: productsRef,
        collection: collectionRef,
        about: aboutRef,
        contact: contactRef
      };
      refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const updatedCart = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return updatedCart;
      }
      const updatedCart = [...prev, { ...product, quantity: 1 }];
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Toggle admin panel (Ctrl+Shift+A or URL hash)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A' && isAdmin) {
        setShowAdmin(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin]);

  // If admin panel is shown, display it instead of main content
  if (showAdmin && isAdmin) {
    return (
      <>
        <div style={{ 
          padding: '1rem', 
          background: '#f5f5f5', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #ddd'
        }}>
          <button 
            onClick={() => setShowAdmin(false)}
            style={{
              padding: '0.5rem 1rem',
              background: '#8B7355',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ← Back to Website
          </button>
          <span style={{ color: '#8B7355', fontWeight: 'bold' }}>Admin Dashboard</span>
        </div>
        <AdminPanel />
      </>
    );
  }

  return (
    <div className="app">
      {/* Admin button - ONLY visible to admin users */}
      {isAdmin && !showAdmin && (
        <button
          onClick={() => {
            console.log('Opening admin panel via button');
            setShowAdmin(true);
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '12px 20px',
            background: '#8B7355',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <span style={{ fontSize: '16px' }}>👑</span>
          Admin Panel
        </button>
      )}
      
      <Navbar 
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        setShowCart={setShowCart}
        scrollToSection={scrollToSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div ref={heroRef}>
        <Hero />
      </div>
      
      <div ref={productsRef}>
        <Products 
          addToCart={addToCart}
          setShowQuickView={setShowQuickView}
          searchQuery={searchQuery}
        />
      </div>
      
      <div ref={collectionRef}>
        <Collection />
      </div>
      
      <div ref={aboutRef}>
        <About />
      </div>
      
      <div ref={contactRef}>
        <Contact />
      </div>

      {showCart && (
        <CartModal 
          cartItems={cartItems}
          setShowCart={handleCloseCart}
          setShowCheckout={handleOpenCheckout}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      )}

      {showQuickView && (
        <QuickViewModal 
          product={showQuickView}
          setShowQuickView={setShowQuickView}
          addToCart={addToCart}
        />
      )}

      {showCheckout && (
        <Checkout 
          cartItems={cartItems}
          setShowCheckout={setShowCheckout}
          setShowCart={setShowCart}
          clearCart={clearCart}
        />
      )}

      <AuthModal />
    </div>
  );
}

// Orders Page Component
function OrdersPage() {
  return (
    <div className="orders-page">
      <MyOrders />
    </div>
  );
}

// Main App component with AuthProvider and Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;