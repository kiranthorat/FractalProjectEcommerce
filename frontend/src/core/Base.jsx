import React from 'react';
import Menu from './Menu';

const Base = ({
  title = "My Title",
  description = "My Description",
  className = "bg-dark text-white p-4",
  style = {},
  headerStyle = {},
  headerClassName = "jumbotron bg-dark text-white text-center py-3",
  children
}) => {
  return (
    <div>
      <Menu />
      <div className="container-fluid p-0">
        <div className={headerClassName} style={headerStyle}>
          <div className="container-fluid px-4">
            <h2 className="display-6">{title}</h2>
            <p className="mb-1">{description}</p>
          </div>
        </div>
        <div className="container-fluid px-0">
          <div className={className} style={style}>{children}</div>
        </div>
      </div>
      <footer className="footer bg-dark mt-auto py-3">
        <div className="container-fluid bg-dark text-white text-center py-3">
          <h4>Have questions? We're here to help!</h4>
          <div className="d-flex justify-content-center mb-3">
            <button 
              className="btn btn-warning btn-lg"
              onClick={() => window.open('mailto:support@ecommerce.com?subject=Customer Support&body=Hello, I have a question about...', '_blank')}
            >
              <i className="fas fa-envelope me-2"></i>
              Email Us
            </button>
          </div>
          <div className="container">
            <span className="text-white">
              <i className="fas fa-shield-alt me-2"></i>
              Secure Shopping • Fast Delivery • 24/7 Support
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Base;
