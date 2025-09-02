import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Base from '../core/Base';
import { isAuthenticated } from '../auth';
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from './helper/AddressHelper';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    address_type: 'home',
    full_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: false
  });

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/user/signin" replace />;
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const addressList = await getUserAddresses();
      setAddresses(addressList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await addAddress(formData);
      }
      
      setShowForm(false);
      setEditingAddress(null);
      resetForm();
      await loadAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      address_type: address.address_type || 'home',
      full_name: address.full_name || '',
      phone_number: address.phone_number || '',
      address_line_1: address.address_line_1 || '',
      address_line_2: address.address_line_2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || 'India',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        setLoading(true);
        await deleteAddress(addressId);
        await loadAddresses();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setLoading(true);
      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      address_type: 'home',
      full_name: '',
      phone_number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      is_default: false
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    resetForm();
  };

  return (
    <Base 
      title="Address Management" 
      description="Manage your delivery addresses"
      className="bg-light p-0"
      style={{ minHeight: '80vh' }}
    >
      <div className="container py-5">
        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Add New Address Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Your Addresses</h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            disabled={loading}
          >
            <i className="fas fa-plus me-2"></i>
            Add New Address
          </button>
        </div>

        {/* Address Form */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address Type</label>
                    <select
                      name="address_type"
                      value={formData.address_type}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address Line 1</label>
                  <input
                    type="text"
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="House/Flat number, Street name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Landmark, Area"
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleInputChange}
                      className="form-check-input"
                      id="isDefault"
                    />
                    <label className="form-check-label" htmlFor="isDefault">
                      Set as default address
                    </label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={cancelForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Address List */}
        {loading && !showForm ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {addresses.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <i className="fas fa-map-marker-alt fa-3x mb-3"></i>
                  <h5>No addresses found</h5>
                  <p>Add your first delivery address to get started.</p>
                </div>
              </div>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="col-lg-6 col-md-12 mb-4">
                  <div className={`card h-100 ${address.is_default ? 'border-primary' : ''}`}>
                    {address.is_default && (
                      <div className="card-header bg-primary text-white">
                        <small><i className="fas fa-star me-1"></i>Default Address</small>
                      </div>
                    )}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                        </h6>
                        <span className="badge bg-secondary">{address.address_type}</span>
                      </div>
                      
                      <p className="card-text">
                        <strong>{address.full_name}</strong><br />
                        <small className="text-muted">
                          <i className="fas fa-phone me-1"></i>
                          {address.phone_number}
                        </small>
                      </p>
                      
                      <address className="card-text">
                        {address.full_address}
                      </address>
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between">
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(address)}
                          >
                            <i className="fas fa-edit me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(address.id)}
                          >
                            <i className="fas fa-trash me-1"></i>Delete
                          </button>
                        </div>
                        {!address.is_default && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            <i className="fas fa-star me-1"></i>Set Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Base>
  );
};

export default AddressManagement;
