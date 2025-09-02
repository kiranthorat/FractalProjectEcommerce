import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Base from './Base';
import CartItem from './CartItem';
import { getCart, removeFromCart, clearCart } from './helper/CartHelper';
import { isAuthenticated } from '../auth';

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadCartData = async () => {
      const cartData = await getCart();
      setProducts(cartData);
    };
    loadCartData();
  }, [reload]);



  const loadCheckout = () => {
    return isAuthenticated() ? (
      <div>
        <Link to="/checkout">
          <button className="btn btn-success">Checkout</button>
        </Link>
      </div>
    ) : (
      <div>
        <Link to="/user/signin">
          <button className="btn btn-warning">Sign in to checkout</button>
        </Link>
      </div>
    );
  };

  const getTotal = () => {
    return products.reduce((total, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = product.quantity || 1;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return products.reduce((total, product) => {
      return total + (product.quantity || 1);
    }, 0);
  };

  const emptyCart = async () => {
    await clearCart(() => {
      setReload(!reload);
      console.log('Cart is empty now');
    });
  };

  return (
    <Base title="Shopping Cart" description="Review your items before checkout" className="bg-light p-0">
      <div className="container py-4">
        {products.length > 0 ? (
          <div className="row">
            {/* Cart Items Section */}
            <div className="col-lg-8 col-md-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Your Cart Items ({getTotalItems()} items, {products.length} products)
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="row g-3 p-3">
                    {products.map((product, index) => (
                      <div key={index} className="col-12">
                        <div className="mb-3">
                          <CartItem
                            product={product}
                            setReload={setReload}
                            reload={reload}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex gap-2 mt-3">
                <Link to="/" className="btn btn-outline-primary">
                  <i className="fas fa-arrow-left me-2"></i>
                  Continue Shopping
                </Link>
                <button 
                  className="btn btn-outline-danger" 
                  onClick={emptyCart}
                >
                  <i className="fas fa-trash me-2"></i>
                  Empty Cart
                </button>
              </div>
            </div>

            {/* Cart Summary Section */}
            <div className="col-lg-4 col-md-12">
              <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-calculator me-2"></i>
                    Order Summary
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({getTotalItems()}):</span>
                    <span>${getTotal()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong className="text-dark">Total:</strong>
                    <strong className="text-success">${getTotal()}</strong>
                  </div>
                  
                  {/* Product List */}
                  <div className="mb-3">
                    <small className="text-muted">Items in your cart:</small>
                    {products.map((product, index) => {
                      const quantity = product.quantity || 1;
                      const price = parseFloat(product.price) || 0;
                      const itemTotal = (price * quantity).toFixed(2);
                      
                      return (
                        <div key={index} className="d-flex justify-content-between small mt-1">
                          <span className="text-truncate me-2">
                            {product.name} x{quantity}
                          </span>
                          <span>${itemTotal}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="d-grid">
                    {loadCheckout()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="card shadow-sm mx-auto" style={{maxWidth: '500px'}}>
              <div className="card-body p-5">
                <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h3 className="text-muted">Your cart is empty</h3>
                <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
                <Link to="/" className="btn btn-primary btn-lg">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Base>
  );
};

export default Cart;