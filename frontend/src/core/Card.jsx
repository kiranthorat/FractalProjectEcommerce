import React, { useState } from 'react';
import ImageHelper from './helper/ImageHelper';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { addToCart, removeFromCart } from './helper/CartHelper';

const Card = ({
  product,
  addtoCart = true,
  removeFromCart = false,
  setReload = f => f, // Function to trigger reload
  reload = undefined
}) => {
  const [redirect, setRedirect] = useState(false);

  const cardTitle = product ? product.name : "A photo from pexels";
  const cardDescription = product ? product.description : "Default description";
  const cardPrice = product ? product.price : "Default";

  const addToCartHandler = () => {
    if (isAuthenticated()) {
      addToCart(product, () => {
        console.log("Added to cart!");
        setRedirect(true);
      });

    } else {
      console.log("Login Please!");
      setRedirect('/user/signin');
    }
  };

  const removeFromCartHandler = () => {
    removeFromCart(product.id, () => {
      setReload(!reload);
      console.log("Product removed from cart");
    });
  };

  const getRedirect = (redirect) => {
    if (redirect === true) {
      return <Navigate to="/cart" replace />;
    } else if (typeof redirect === 'string') {
      return <Navigate to={redirect} replace />;
    }
  };

  const showAddToCart = (addtoCart) => {
    return (addtoCart && (
      <button
        onClick={addToCartHandler}
        className="btn w-100 btn-outline-success mt-2 mb-2"
      >
        Add to Cart
      </button>
    ));
  };

  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <button
          onClick={removeFromCartHandler}
          className="btn w-100 btn-outline-danger mt-2 mb-2"
        >
          Remove from cart
        </button>
      )
    );
  };

  return (
    <div className="card h-100 shadow-sm border-0" style={{ minHeight: '400px' }}>
      {getRedirect(redirect)}
      <div className="card-header bg-dark text-white p-2">
        <h6 className="card-title mb-0 text-truncate small">{cardTitle}</h6>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <ImageHelper product={product} />
        <p className="card-text flex-grow-1 text-muted small text-truncate" style={{ minHeight: '40px' }}>
          {cardDescription}
        </p>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="h5 text-success mb-0">${cardPrice}</span>
            <small className="text-muted">
              <i className="fas fa-star text-warning"></i> 4.5
            </small>
          </div>
          <div className="d-grid gap-1">
            {showAddToCart(addtoCart)}
            {showRemoveFromCart(removeFromCart)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;