import React, { useState, useEffect } from 'react';
import Base from '../core/Base';
import { isAuthenticated } from '../auth';
import { Navigate, Link } from 'react-router-dom';
import { API } from '../backend';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      loadUserOrders();
    }
  }, []);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const authData = isAuthenticated();
      
      // Make API call to get user orders
      const response = await fetch(`http://localhost:8000/api/order/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Orders API response:', data); // Debug log
        
        // Handle different response structures
        let ordersList = [];
        if (Array.isArray(data)) {
          ordersList = data;
        } else if (data.results && Array.isArray(data.results)) {
          ordersList = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          ordersList = data.data;
        }
        
        // Filter orders for current user and ensure data types
        const userOrders = ordersList
          .filter(order => order.user === authData.user.id)
          .map(order => ({
            ...order,
            // Handle default values and convert types properly
            total_products: (order.total_products && order.total_products !== '0') ? 
              parseInt(order.total_products) : 0,
            total_amount: (order.total_amount && order.total_amount !== '0') ? 
              parseFloat(order.total_amount) : 0,
            transaction_id: (order.transaction_id && order.transaction_id !== '0') ? 
              order.transaction_id : `ORD-${order.id}`,
            product_names: (order.product_names && order.product_names.trim()) ? 
              order.product_names : 'No products listed'
          }));
        
        console.log('Processed user orders:', userOrders); // Debug log
        setOrders(userOrders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/user/signin" replace />;
  }

  return (
    <Base 
      title="My Orders" 
      description="View your order history and track your purchases"
      className="bg-light p-0"
      style={{ minHeight: '80vh' }}
    >
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h4 className="mb-0">
                  <i className="fas fa-box me-2"></i>
                  Order History
                </h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your orders...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Orders Yet</h5>
                    <p className="text-muted mb-4">
                      You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                    <a href="/" className="btn btn-dark">
                      <i className="fas fa-shopping-cart me-2"></i>
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Order ID</th>
                          <th>Products</th>
                          <th>Total Items</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Link 
                                to={`/user/orders/${order.id}`}
                                className="text-decoration-none"
                              >
                                <code className="text-primary">
                                  #{order.transaction_id || order.id}
                                </code>
                              </Link>
                            </td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                {order.product_names}
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {order.total_products} item(s)
                              </span>
                            </td>
                            <td>
                              <strong className="text-success">
                                ${order.total_amount}
                              </strong>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatDate(order.created_at)}
                              </small>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                <i className="fas fa-check me-1"></i>
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Stats */}
        {orders.length > 0 && (
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card text-center bg-dark text-white">
                <div className="card-body">
                  <h3>{orders.length}</h3>
                  <p className="mb-0">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center bg-dark text-white">
                <div className="card-body">
                  <h3>
                    ${orders.reduce((total, order) => {
                      const amount = parseFloat(order.total_amount) || 0;
                      return total + amount;
                    }, 0).toFixed(2)}
                  </h3>
                  <p className="mb-0">Total Spent</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center bg-dark text-white">
                <div className="card-body">
                  <h3>
                    {orders.reduce((total, order) => {
                      const products = parseInt(order.total_products) || 0;
                      return total + products;
                    }, 0)}
                  </h3>
                  <p className="mb-0">Items Purchased</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Base>
  );
};

export default Orders;
