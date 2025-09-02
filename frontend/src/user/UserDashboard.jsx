import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import Base from '../core/Base';
import { isAuthenticated } from '../auth';

const UserDashboard = () => {
  const authData = isAuthenticated();

  // Redirect if not authenticated
  if (!authData) {
    return <Navigate to="/user/signin" replace />;
  }

  const user = authData.user;

  return (
    <Base 
      title="User Dashboard" 
      description={`Welcome back, ${user.name || user.email}!`}
      className="bg-light p-0"
      style={{ minHeight: '80vh' }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          {/* User Info Card */}
          <div className="col-lg-8 col-md-10 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">
                  <i className="fas fa-user me-2"></i>
                  Profile Information
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <i className="fas fa-user-circle fa-5x text-dark mb-3"></i>
                  <h4 className="text-dark">{user.name || user.email}</h4>
                </div>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <div className="mb-3">
                      <small className="text-muted">Name:</small>
                      <div className="fw-bold">{user.name || 'Not provided'}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="mb-3">
                      <small className="text-muted">Email:</small>
                      <div className="fw-bold">{user.email}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="mb-3">
                      <small className="text-muted">Phone:</small>
                      <div className="fw-bold">{user.phone || 'Not provided'}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="mb-3">
                      <small className="text-muted">Gender:</small>
                      <div className="fw-bold">{user.gender || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link 
                      to="/user/edit-profile" 
                      className="btn btn-dark btn-lg px-4"
                    >
                      <i className="fas fa-edit me-2"></i>
                      Edit Profile
                    </Link>
                    <Link 
                      to="/user/addresses" 
                      className="btn btn-dark btn-lg px-4"
                    >
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Manage Addresses
                    </Link>
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

export default UserDashboard;
