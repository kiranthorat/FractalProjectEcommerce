import React, { useState, useEffect } from 'react';
import { getProducts, getCategories } from './helper/Coreapicalls';
import { API } from '../backend';
import Base from './Base';
import Card from './Card';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Temporary inline function to avoid import issues
  const getProductsByCategory = (categoryId) => {
    const url = categoryId ? `${API}/product/?category=${categoryId}` : `${API}/product/`;
    return fetch(url, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  const loadAllProducts = () => {
    setLoading(true);
    getProducts().then((data) => {
      if (data && data.error) {
        setError(data.error);
        console.log(error);
      } else {
        setProducts(data?.results || data || []);
      }
      setLoading(false);
    });
  };

  const loadCategories = () => {
    setCategoriesLoading(true);
    getCategories().then((data) => {
      if (data && data.error) {
        console.log('Error loading categories:', data.error);
      } else {
        setCategories(data?.results || data || []);
      }
      setCategoriesLoading(false);
    });
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    getProductsByCategory(categoryId).then((data) => {
      if (data && data.error) {
        setError(data.error);
        console.log(error);
      } else {
        setProducts(data?.results || data || []);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAllProducts();
    loadCategories();
  }, []);

  if (loading) {
    return (
      <Base title="Loading..." description="Please wait">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Base>
    );
  }

  return (
    <Base 
      title="Welcome to Our Store" 
      description="Discover amazing products at great prices"
      headerClassName="text-white text-center py-3 bg-dark"
      headerStyle={{
        minHeight: '15vh',
        display: 'flex',
        alignItems: 'center'
      }}
      className="bg-white p-0" 
      style={{
        minHeight: '40vh'
      }}
    >
      {/* Category Filter Section - Full Width like Navbar */}
      <div className="bg-dark shadow-lg mb-3">
        <div className="container-fluid py-2">
          <div className="row">
            <div className="col-12">
              <h6 className="text-center text-white mb-2">
                  <i className="fas fa-filter me-2"></i>
                  Shop by Category
                </h6>
                
                {categoriesLoading ? (
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading categories...</span>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    {/* All Products Button */}
                    <button
                      className={`btn ${selectedCategory === '' ? 'btn-light text-dark' : 'btn-outline-light text-white'} btn-sm`}
                      onClick={() => handleCategoryFilter('')}
                    >
                      <i className="fas fa-globe me-1"></i>
                      All Products
                      {selectedCategory === '' && <span className="badge bg-dark text-white ms-2">Active</span>}
                    </button>
                    
                    {/* Category Buttons */}
                    {categories && categories.length > 0 && categories.map((category) => (
                      <button
                        key={category.id}
                        className={`btn ${selectedCategory === category.id ? 'btn-light text-dark' : 'btn-outline-light text-white'} btn-sm`}
                        onClick={() => handleCategoryFilter(category.id)}
                      >
                        <i className="fas fa-tag me-1"></i>
                        {category.name}
                        {selectedCategory === category.id && <span className="badge bg-dark text-white ms-2">Active</span>}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-3">

        <div className="row mb-3">
          <div className="col-12">
            <h3 className="text-center mb-2 text-dark">
              {selectedCategory === '' ? 'All Products' : 
               categories.find(cat => cat.id === selectedCategory)?.name || 'Featured Products'}
            </h3>
            <hr className="mx-auto bg-dark" style={{width: '100px', height: '2px', opacity: '0.8'}} />
          </div>
        </div>
      
        <div className="row g-4 px-3">
          {products && products.length > 0 ? (
            products.map((product, index) => {
              return (
                <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                  <Card product={product} />
                </div>
              );
            })
          ) : (
            <div className="col-12 text-center py-5">
              <div className="alert alert-light">
                <h4>No products available</h4>
                <p className="mb-0">Check back later for new arrivals!</p>
              </div>
            </div>
          )}
        </div>
        {/* Hero Section for Better UX */}
        {products && products.length === 0 && (
          <div className="row mt-5 px-3">
            <div className="col-12 text-center">
              <div className="card border-0 bg-white text-dark shadow-lg">
                <div className="card-body py-5">
                  <h3>Welcome to Our E-Commerce Store!</h3>
                  <p className="lead">Sign up today to start shopping and get exclusive deals!</p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <a href="/user/signup" className="btn btn-primary btn-lg">
                      <i className="fas fa-user-plus me-2"></i>Sign Up
                    </a>
                    <a href="/user/signin" className="btn btn-outline-primary btn-lg">
                      <i className="fas fa-sign-in-alt me-2"></i>Sign In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Base>
  );
}
