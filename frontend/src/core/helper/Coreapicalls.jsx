import { API } from '../../backend';

// Get all products
export const getProducts = () => {
  return fetch(`${API}/product/`, { 
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

// Get all categories
export const getCategories = () => {
  return fetch(`${API}/category/`, { 
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

// Get products by category - filters by category ID or returns all if no ID provided
export const getProductsByCategory = (categoryId) => {
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

// Get single product
export const getProduct = (productId) => {
  return fetch(`${API}/product/${productId}/`, { 
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
