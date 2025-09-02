import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './core/Home';
import SignIn from './user/Signin';
import SignUp from './user/Signup';
import Cart from './core/Cart';
import Checkout from './core/Checkout';
import Orders from './user/Orders';
import UserDashboard from './user/UserDashboard';
import EditProfile from './user/EditProfile';
import AddressManagement from './user/AddressManagement';
import OrderDetails from './user/OrderDetails';
import PrivateRoute from './auth/helper/PrivateRoutes.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/signin" element={<SignIn />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route 
          path="/checkout" 
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user/orders" 
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user/dashboard" 
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user/edit-profile" 
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user/addresses" 
          element={
            <PrivateRoute>
              <AddressManagement />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user/orders/:orderId" 
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;