import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Base from './Base';
import { getCart, clearCart } from './helper/CartHelper';
import { isAuthenticated } from '../auth';
import { createOrder } from './helper/OrderHelper';
import { processPayment, validatePaymentData } from './helper/PaymentHelper';
import { getUserAddresses } from '../user/helper/AddressHelper';

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  useEffect(() => {
    const loadData = async () => {
      // Load cart data
      const cartData = await getCart();
      setProducts(cartData);
      
      // Load user addresses
      try {
        const userAddresses = await getUserAddresses();
        setAddresses(userAddresses);
        
        // Set default address if available
        const defaultAddress = userAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (userAddresses.length > 0) {
          setSelectedAddress(userAddresses[0]);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    };
    
    loadData();
    
    if (isAuthenticated()) {
      setUser(isAuthenticated().user);
    }
  }, []);

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

  const handlePaymentChange = (field) => (event) => {
    setPaymentData({
      ...paymentData,
      [field]: event.target.value
    });
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Validate address selection
    if (!selectedAddress) {
      setError('Please select a delivery address.');
      setLoading(false);
      return;
    }

    // Validate payment data
    const validation = validatePaymentData(paymentData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      setLoading(false);
      return;
    }

    try {
      // Process payment
      const paymentResult = await processPayment({
        ...paymentData,
        amount: getTotal()
      });

      if (paymentResult.success) {
        // Create order with quantity and address information
        const productDetails = products.map(p => `${p.name} x${p.quantity || 1}`).join(', ');
        const orderData = {
          transaction_id: paymentResult.transaction_id,
          amount: getTotal(),
          products: productDetails,
          // Include delivery address
          delivery_name: selectedAddress.full_name,
          delivery_phone: selectedAddress.phone_number,
          delivery_address_line_1: selectedAddress.address_line_1,
          delivery_address_line_2: selectedAddress.address_line_2,
          delivery_city: selectedAddress.city,
          delivery_state: selectedAddress.state,
          delivery_postal_code: selectedAddress.postal_code,
          delivery_country: selectedAddress.country
        };

        const authData = isAuthenticated();
        const orderResult = await createOrder(orderData);

        if (orderResult.success) {
          // Clear cart and show success
          await clearCart(() => {
            setSuccess(true);
            setLoading(false);
          });
        } else {
          setError('Order creation failed. Please contact support.');
          setLoading(false);
        }
      } else {
        setError('Payment failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
      console.error(err);
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to="/user/signin" replace />;
  }

  if (success) {
    return (
      <Base title="Order Successful!" description="Thank you for your purchase">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="alert alert-success">
              <h3>🎉 Order Placed Successfully!</h3>
              <p>Your order has been confirmed and will be processed shortly.</p>
              <p>You will receive a confirmation email at {user.email}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/'}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </Base>
    );
  }

  return (
    <Base title="Checkout" description="Complete your purchase" className="bg-light p-0">
      <div className="container py-4">
        <div className="row">
          {/* Address Selection */}
          <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Delivery Address
                </h5>
              </div>
              <div className="card-body">
                {addresses.length === 0 ? (
                  <div className="alert alert-warning">
                    <h6>No delivery address found!</h6>
                    <p className="mb-2">Please add a delivery address to continue with checkout.</p>
                    <a href="/user/addresses" className="btn btn-warning btn-sm">
                      <i className="fas fa-plus me-1"></i>Add Address
                    </a>
                  </div>
                ) : (
                  <div>
                    <div className="row">
                      {addresses.map((address) => (
                        <div key={address.id} className="col-lg-6 col-md-12 mb-3">
                          <div 
                            className={`card h-100 cursor-pointer ${
                              selectedAddress && selectedAddress.id === address.id 
                                ? 'border-success bg-light' 
                                : 'border-secondary'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="card-title mb-2">
                                    <i className="fas fa-map-marker-alt me-2"></i>
                                    {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                                    {address.is_default && (
                                      <span className="badge bg-primary ms-2">Default</span>
                                    )}
                                  </h6>
                                  <p className="card-text mb-1">
                                    <strong>{address.full_name}</strong>
                                  </p>
                                  <p className="card-text mb-1">
                                    <small className="text-muted">
                                      <i className="fas fa-phone me-1"></i>
                                      {address.phone_number}
                                    </small>
                                  </p>
                                  <address className="card-text mb-0">
                                    <small>{address.full_address}</small>
                                  </address>
                                </div>
                                <div>
                                  {selectedAddress && selectedAddress.id === address.id && (
                                    <i className="fas fa-check-circle text-success fa-lg"></i>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedAddress && (
                      <div className="mt-3 p-3 bg-success bg-opacity-10 border border-success rounded">
                        <h6 className="text-success mb-2">
                          <i className="fas fa-check-circle me-2"></i>
                          Selected Delivery Address:
                        </h6>
                        <div className="row">
                          <div className="col-md-6">
                            <strong>{selectedAddress.full_name}</strong><br />
                            <small className="text-muted">{selectedAddress.phone_number}</small>
                          </div>
                          <div className="col-md-6">
                            <small>{selectedAddress.full_address}</small>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <a href="/user/addresses" className="btn btn-outline-info btn-sm">
                        <i className="fas fa-edit me-1"></i>Manage Addresses
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-credit-card me-2"></i>
                  Payment Information
                </h5>
              </div>
              <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleCheckout}>
                <div className="mb-3">
                  <label className="form-label">Card Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentData.cardHolderName}
                    onChange={handlePaymentChange('cardHolderName')}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className="form-control"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange('expiryDate')}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange('cvv')}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay $${getTotal()}`}
                </button>
              </form>
            </div>
          </div>
        </div>
          
        {/* Order Summary */}
          <div className="col-lg-4 col-md-12">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Order Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6 className="text-muted">Items ({getTotalItems()})</h6>
                  {products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between mb-2 small">
                      <span className="text-truncate me-2">
                        {product.name} x{product.quantity || 1}
                      </span>
                      <span>${((parseFloat(product.price) || 0) * (product.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${getTotal()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-success">${getTotal()}</strong>
                  </div>
                </div>

                {/* Delivery Address in Summary */}
                {selectedAddress && (
                  <div className="border-top pt-3 mb-3">
                    <h6 className="text-muted mb-2">
                      <i className="fas fa-truck me-1"></i>
                      Delivery Address
                    </h6>
                    <div className="small">
                      <strong>{selectedAddress.full_name}</strong><br />
                      <span className="text-muted">{selectedAddress.phone_number}</span><br />
                      <span>{selectedAddress.address_line_1}</span><br />
                      {selectedAddress.address_line_2 && (
                        <span>{selectedAddress.address_line_2}<br /></span>
                      )}
                      <span>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}</span><br />
                      <span>{selectedAddress.country}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center text-muted small">
                  <i className="fas fa-lock me-1"></i>
                  Your payment information is secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Checkout;