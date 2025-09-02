import React, { useState } from 'react';
import { updateCartItemQuantity, decreaseCartItemQuantity, removeFromCart } from './helper/CartHelper';

const CartItem = ({ product, setReload, reload }) => {
  const [loading, setLoading] = useState(false);

  const handleQuantityIncrease = () => {
    setLoading(true);
    const newQuantity = (product.quantity || 1) + 1;
    updateCartItemQuantity(product.id, newQuantity, () => {
      setReload(!reload);
      setLoading(false);
    });
  };

  const handleQuantityDecrease = () => {
    setLoading(true);
    decreaseCartItemQuantity(product.id, () => {
      setReload(!reload);
      setLoading(false);
    });
  };

  const handleRemoveItem = () => {
    setLoading(true);
    removeFromCart(product.id, () => {
      setReload(!reload);
      setLoading(false);
    });
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setLoading(true);
      updateCartItemQuantity(product.id, newQuantity, () => {
        setReload(!reload);
        setLoading(false);
      });
    }
  };

  const getItemTotal = () => {
    const price = parseFloat(product.price) || 0;
    const quantity = product.quantity || 1;
    return (price * quantity).toFixed(2);
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="row g-0 h-100">
        {/* Product Image */}
        <div className="col-md-4">
          <div className="p-3">
            <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
              <img
                src={product?.image || 'https://i.imgur.com/z7EiIyZ.jpg'}
                alt={product?.name || 'Product'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="col-md-8">
          <div className="card-body d-flex flex-column h-100">
            <div className="flex-grow-1">
              <h5 className="card-title text-dark mb-2">
                {product.name || 'Product Name'}
              </h5>
              <p className="card-text text-muted small mb-3">
                {product.description || 'Product description'}
              </p>
              <div className="row align-items-center mb-3">
                <div className="col-6">
                  <span className="h6 text-success mb-0">
                    ${product.price || '0.00'} each
                  </span>
                </div>
                <div className="col-6 text-end">
                  <span className="h5 text-primary mb-0">
                    Total: ${getItemTotal()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quantity Controls */}
            <div className="mt-auto">
              <div className="row align-items-center">
                <div className="col-md-6 mb-2">
                  <label className="form-label small fw-bold mb-1">Quantity:</label>
                  <div className="input-group input-group-sm">
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleQuantityDecrease}
                      disabled={loading || (product.quantity || 1) <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      className="form-control text-center"
                      value={product.quantity || 1}
                      onChange={handleQuantityChange}
                      min="1"
                      disabled={loading}
                      style={{ maxWidth: '80px' }}
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleQuantityIncrease}
                      disabled={loading}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <div className="col-md-6 mb-2">
                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={handleRemoveItem}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Removing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash me-1"></i>
                        Remove Item
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
