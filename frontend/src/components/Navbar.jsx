import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar({ cartItemsCount, setShowCart, scrollToSection, searchQuery, setSearchQuery }) {
  const { user, setShowAuthModal, setAuthMode, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setShowUserDropdown(false);
  }, [location]);

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection('hero');
      }, 100);
    } else {
      scrollToSection('hero');
    }
  };

  const handleNavClick = (section) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        scrollToSection(section);
      }, 100);
    } else {
      scrollToSection(section);
    }
  };

  const handleMyOrders = (e) => {
    e.preventDefault();
    navigate('/orders');
    setShowUserDropdown(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setShowUserDropdown(false);
    // If on orders page, redirect to home
    if (location.pathname === '/orders') {
      navigate('/');
    }
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        <div className="logo" onClick={handleLogoClick}>
          FURNITURE
        </div>
        
        <div className="nav-links">
          <a onClick={() => handleNavClick('hero')}>Home</a>
          <a onClick={() => handleNavClick('products')}>Products</a>
          <a onClick={() => handleNavClick('collection')}>Collection</a>
          <a onClick={() => handleNavClick('about')}>About</a>
          <a onClick={() => handleNavClick('contact')}>Contact</a>
        </div>
        
        <div className="nav-icons">
          
          {/* 🔍 SEARCH */}
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span>🔍</span>
          </div>
          
          {/* 🛒 CART */}
          <div className="icon-wrapper" onClick={handleCartClick}>
            🛒
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </div>
          
          {/* 👤 USER */}
          <div className="user-dropdown-container" ref={dropdownRef}>
            <div 
              className="icon-wrapper"
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  setAuthMode('login');
                  setShowAuthModal(true);
                } else {
                  setShowUserDropdown(prev => !prev);
                }
              }}
            >
              👤
            </div>
            
            {user && showUserDropdown && (
              <div 
                className="user-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                  {user.role === 'admin' && (
                    <span className="admin-badge">Admin</span>
                  )}
                </div>

                <div className="dropdown-divider"></div>

                <a 
                  href="/orders" 
                  onClick={handleMyOrders}
                  className="dropdown-link"
                >
                  📦 My Orders
                </a>

                {user.role === 'admin' && (
                  <>
                    <div className="dropdown-divider"></div>
                    <a 
                      href="#admin" 
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = 'admin';
                        setShowUserDropdown(false);
                      }}
                      className="dropdown-link admin-link"
                    >
                      👑 Admin Panel
                    </a>
                  </>
                )}

                <div className="dropdown-divider"></div>

                <a 
                  href="#logout" 
                  onClick={handleLogout}
                  className="dropdown-link logout-link"
                >
                  🚪 Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;