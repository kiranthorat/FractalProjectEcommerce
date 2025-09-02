import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Fixed: Redirect → Navigate
import { authenticate, isAuthenticated, signin } from '../auth';
import Base from '../core/Base';

const Signin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    success: false,
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, success, loading, didRedirect } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });

    signin({ email, password })
      .then((data) => {
        console.log('DATA', data);
        if (data && data.token) {
          let sessionToken = data.token;
          authenticate(data, () => { // Fixed: Pass full data, not just token
            console.log('TOKEN ADDED');
            setValues({
              ...values,
              didRedirect: true,
              loading: false,
            });
          });
        } else {
          setValues({
            ...values,
            loading: false,
            error: data?.error || 'Login failed. Please check your credentials.',
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setValues({
          ...values,
          loading: false,
          error: 'Network error. Please try again.',
        });
      });
  };

  const performRedirect = () => { // Fixed: typo peformRedirect → performRedirect
    if (didRedirect || isAuthenticated()) {
      return <Navigate to="/" replace />; // Fixed: Redirect → Navigate
    }
  };

  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h2>Loading....</h2>
        </div>
      )
    );
  };

  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-start"> {/* Fixed: offset-sm-3 → offset-md-3 */}
          <div
            className="alert alert-danger"
            style={{ display: error ? '' : 'none' }}
          >
            {error || 'Check all fields again!'}
          </div>
        </div>
      </div>
    );
  };

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3 text-start"> {/* Fixed: offset sm-3 → offset-md-3 */}
          <form>
            <div className="mb-3"> {/* Fixed: form-group → mb-3 */}
              <label className="form-label text-light">Email</label> {/* Fixed: Added form-label */}
              <input
                className="form-control"
                value={email}
                onChange={handleChange('email')}
                type="email"
                required
              />
            </div>
            <div className="mb-3"> {/* Fixed: form-group → mb-3 */}
              <label className="form-label text-light">Password</label> {/* Fixed: Added form-label */}
              <input
                className="form-control"
                value={password}
                onChange={handleChange('password')}
                type="password" 
                required
              />
            </div>
            <button 
              onClick={onSubmit} 
              className="btn btn-success w-100" /* Fixed: btn-block → w-100 */
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Welcome to sign in page" description="E-commerce Store Login">
      {loadingMessage()}
      {errorMessage()}
      {signInForm()}
      <p className="text-center text-light">
        Don't have an account? <Link to="/user/signup">Sign up here</Link>
      </p>
      {performRedirect()}
    </Base>
  );
};

export default Signin;