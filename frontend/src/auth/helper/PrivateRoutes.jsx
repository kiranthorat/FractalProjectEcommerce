import React from 'react';
import { Navigate } from 'react-router-dom'; // Updated for React Router v6
import { isAuthenticated } from '../index';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/user/signin" replace />;
};

export default PrivateRoute;
