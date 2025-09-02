import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Base from '../core/Base';
import { isAuthenticated } from '../auth';
import { updateUserProfile } from './helper/UserApiCalls';

const EditProfile = () => {
  const navigate = useNavigate();
  const authData = isAuthenticated();
  
  // Individual state for each field to avoid React controlled input issues
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Redirect if not authenticated
  if (!authData) {
    return <Navigate to="/user/signin" replace />;
  }

  useEffect(() => {
    // Initialize form with user data
    if (authData && authData.user && !initialized) {
      const user = authData.user;
      console.log('Initializing form with user data:', user);
      
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setGender(user.gender || '');
      setInitialized(true);
    }
  }, [authData, initialized]);

  const handleInputChange = (setter) => (e) => {
    console.log('Input changed:', e.target.name, e.target.value);
    setter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Prepare form data
      const profileData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender: gender
      };
      
      console.log('Submitting profile data:', profileData);
      
      // Make API call to update user profile
      const updatedUser = await updateUserProfile(profileData);
      console.log('Profile updated successfully:', updatedUser);
      
      // Update localStorage auth data with new profile info
      const updatedAuthData = {
        ...authData,
        user: {
          ...authData.user,
          ...updatedUser
        }
      };
      localStorage.setItem('jwt', JSON.stringify(updatedAuthData));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Base 
      title="Edit Profile" 
      description="Update your personal information"
      className="bg-light p-0"
      style={{ minHeight: '80vh' }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-edit me-2"></i>
                  Edit Profile Information
                </h4>
              </div>
              <div className="card-body p-4">
                {success && (
                  <div className="alert alert-success">
                    <i className="fas fa-check-circle me-2"></i>
                    Profile updated successfully! Redirecting to dashboard...
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        <i className="fas fa-user me-2"></i>Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleInputChange(setName)}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope me-2"></i>Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                        placeholder="Enter your email"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">
                        <i className="fas fa-phone me-2"></i>Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={handleInputChange(setPhone)}
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gender" className="form-label">
                        <i className="fas fa-venus-mars me-2"></i>Gender
                      </label>
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={gender}
                        onChange={handleInputChange(setGender)}
                        disabled={loading}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Profile
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/user/dashboard')}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default EditProfile;
