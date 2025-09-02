import React, { Fragment, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth';
import { getCart } from './helper/CartHelper';

const currentTab = (location, path) => {
  if (location.pathname === path) {
    return { 
      color: '#2ecc72',
      fontWeight: 'bold',
      borderBottom: '2px solid #2ecc72'
    };
  } else {
    return { color: '#FFFFFF' };
  }
};

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Load cart count on component mount and refresh periodically
  useEffect(() => {
    const loadCartCount = async () => {
      const cartData = await getCart();
      setCartCount(cartData ? cartData.length : 0);
    };
    
    loadCartCount();
    
    // Refresh cart count every 2 seconds to catch updates
    const interval = setInterval(loadCartCount, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSignout = () => {
    signout(() => {
      setCartCount(0); // Clear cart count on signout
      navigate('/');
    });
  };

  return (
    <div>
      <ul className="nav nav-tabs bg-dark" style={{ minHeight: '70px' }}>
        <li className="nav-item">
          <Link 
            style={currentTab(location, '/')} 
            className="nav-link py-3 px-4"
            to="/"
          >
            <i className="fas fa-home me-2" style={{ fontSize: '1.1rem' }}></i>
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Home</span>
          </Link>
        </li>
        
        <li className="nav-item position-relative">
          <Link
            style={currentTab(location, '/cart')}
            className="nav-link py-3 px-4"
            to="/cart"
          >
            <i className="fas fa-shopping-cart me-2" style={{ fontSize: '1.1rem' }}></i>
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Cart</span>
            {cartCount > 0 && (
              <span className="position-absolute badge rounded-pill bg-danger" 
                    style={{ 
                      top: '5px', 
                      right: '5px', 
                      fontSize: '0.75rem',
                      minWidth: '20px',
                      height: '20px',
                      lineHeight: '20px',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}>
                {cartCount}
              </span>
            )}
          </Link>
        </li>
        
        {/* Authenticated User Menu Items */}
        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                style={currentTab(location, '/user/orders')}
                className="nav-link py-3 px-4"
                to="/user/orders"
              >
                <i className="fas fa-box me-2" style={{ fontSize: '1.1rem' }}></i>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Orders</span>
              </Link>
            </li>
          </Fragment>
        )}
        
        {/* Non-authenticated User Menu Items */}
        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                style={currentTab(location, '/user/signup')}
                className="nav-link py-3 px-4"
                to="/user/signup"
              >
                <i className="fas fa-user-plus me-2" style={{ fontSize: '1.1rem' }}></i>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Signup</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                style={currentTab(location, '/user/signin')}
                className="nav-link py-3 px-4"
                to="/user/signin"
              >
                <i className="fas fa-sign-in-alt me-2" style={{ fontSize: '1.1rem' }}></i>
                <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Signin</span>
              </Link>
            </li>
          </Fragment>
        )}

        {/* User Info and Signout */}
        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                to="/user/dashboard"
                className="nav-link text-info py-3 px-4"
                style={{ 
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                title="Go to Dashboard"
              >
                <i className="fas fa-user me-2" style={{ fontSize: '1.1rem' }}></i>
                <span style={{ fontWeight: '500' }}>
                  {isAuthenticated().user?.name || isAuthenticated().user?.email || 'User'}
                </span>
              </Link>
            </li>
            
            <li className="nav-item">
              <span
                onClick={handleSignout}
                className="nav-link text-warning py-3 px-4"
                style={{ 
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}
                title="Sign out"
              >
                <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '1.1rem' }}></i>
                <span>Signout</span>
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default Menu;