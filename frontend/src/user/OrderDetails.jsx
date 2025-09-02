import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Base from '../core/Base';
import { isAuthenticated } from '../auth';
import { API } from '../backend';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const authData = isAuthenticated();
    if (!authData) {
      return;
    }
    
    loadOrderDetails(authData);
  }, [orderId]); // Remove authData from dependency array

  const loadOrderDetails = async (authData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API}/order/${orderId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const data = await response.json();
      
      // Debug: Log the order data to see what's available
      console.log('Order data received:', data);
      
      // Check if this order belongs to the current user
      if (data.user !== authData.user.id) {
        throw new Error('Unauthorized access to order');
      }
      
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Parse products
  const parseProducts = (productNames) => {
    if (!productNames) return [];
    
    // Split by comma and parse each product
    return productNames.split(',').map((product, index) => {
      const trimmed = product.trim();
      // Check if product has quantity (format: "Product Name x2")
      const quantityMatch = trimmed.match(/^(.+?)\s+x(\d+)$/);
      
      if (quantityMatch) {
        return {
          id: index,
          name: quantityMatch[1].trim(),
          quantity: parseInt(quantityMatch[2])
        };
      } else {
        return {
          id: index,
          name: trimmed,
          quantity: 1
        };
      }
    }).filter(product => product.name); // Filter out empty names
  };

  const authData = isAuthenticated();
  if (!authData) {
    return <Navigate to="/user/signin" replace />;
  }

  if (loading) {
    return (
      <Base title="Order Details" description="Loading order information..." className="bg-light p-0">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading order details...</span>
            </div>
            <p className="mt-3">Loading order details...</p>
          </div>
        </div>
      </Base>
    );
  }

  if (error) {
    return (
      <Base title="Order Details" description="Error loading order" className="bg-light p-0">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger text-center">
                <h4><i className="fas fa-exclamation-triangle me-2"></i>Error</h4>
                <p>{error}</p>
                <Link to="/user/orders" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }

  if (!order) {
    return (
      <Base title="Order Details" description="Order not found" className="bg-light p-0">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-warning text-center">
                <h4><i className="fas fa-search me-2"></i>Order Not Found</h4>
                <p>The requested order could not be found.</p>
                <Link to="/user/orders" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i>Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }

  const products = parseProducts(order.product_names);

  return (
    <Base 
      title={`Order #${order.id}`} 
      description="View your order details" 
      className="bg-light p-0"
    >
      <div className="container py-5">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/user/orders" className="btn btn-outline-primary">
            <i className="fas fa-arrow-left me-2"></i>Back to Orders
          </Link>
        </div>

        <div className="row">
          {/* Order Summary Card */}
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Order #{order.id}
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Order Date</h6>
                    <p className="mb-0">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Order Status</h6>
                    <span className={`badge bg-${getStatusColor(order.status)} fs-6`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Transaction ID</h6>
                    <p className="mb-0 font-monospace">{order.transaction_id || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Total Amount</h6>
                    <p className="mb-0 fw-bold text-success fs-5">
                      ${parseFloat(order.total_amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Card */}
          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="fas fa-truck me-2"></i>
                  Order Status
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column">
                  <div className={`mb-2 ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'text-success' : 'text-muted'}`}>
                    <i className="fas fa-check-circle me-2"></i>Order Placed
                  </div>
                  <div className={`mb-2 ${order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered' ? 'text-success' : 'text-muted'}`}>
                    <i className="fas fa-check-circle me-2"></i>Order Confirmed
                  </div>
                  <div className={`mb-2 ${order.status === 'shipped' || order.status === 'delivered' ? 'text-success' : 'text-muted'}`}>
                    <i className="fas fa-shipping-fast me-2"></i>Shipped
                  </div>
                  <div className={`mb-2 ${order.status === 'delivered' ? 'text-success' : 'text-muted'}`}>
                    <i className="fas fa-home me-2"></i>Delivered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Products Card */}
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="fas fa-box me-2"></i>
                  Ordered Items ({order.total_products || products.length})
                </h6>
              </div>
              <div className="card-body">
                {products.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {products.map((product, index) => (
                      <div key={product.id || index} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{product.name}</h6>
                            <small className="text-muted">Quantity: {product.quantity}</small>
                          </div>
                          <div className="text-end">
                            <span className="badge bg-primary">x{product.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted mb-0">No product details available</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Delivery Address
                </h6>
              </div>
              <div className="card-body">
                {order.delivery_name || order.delivery_address_line_1 ? (
                  <div>
                    {order.delivery_name && (
                      <h6 className="mb-2">{order.delivery_name}</h6>
                    )}
                    {order.delivery_phone && (
                      <p className="mb-2">
                        <i className="fas fa-phone me-2"></i>
                        {order.delivery_phone}
                      </p>
                    )}
                    {order.delivery_address_line_1 ? (
                      <address className="mb-0">
                        <small>
                          {order.delivery_address_line_1}<br />
                          {order.delivery_address_line_2 && (
                            <>{order.delivery_address_line_2}<br /></>
                          )}
                          {order.delivery_city && order.delivery_state && (
                            <>{order.delivery_city}, {order.delivery_state} {order.delivery_postal_code}<br /></>
                          )}
                          {order.delivery_country && (
                            <>{order.delivery_country}</>
                          )}
                        </small>
                      </address>
                    ) : order.delivery_address ? (
                      <small>{order.delivery_address}</small>
                    ) : null}
                  </div>
                ) : order.delivery_address ? (
                  <small>{order.delivery_address}</small>
                ) : (
                  <div className="alert alert-info mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>No delivery address on file</strong>
                    <br />
                    <small>This order was placed before address tracking was implemented.</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline Card */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h6 className="mb-0">
                  <i className="fas fa-history me-2"></i>
                  Order Timeline
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="text-muted">Order Placed</h6>
                      <p className="mb-0">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <h6 className="text-muted">Last Updated</h6>
                      <p className="mb-0">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default OrderDetails;
