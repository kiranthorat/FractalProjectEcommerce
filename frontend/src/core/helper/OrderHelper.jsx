import { API } from '../../backend';
import { isAuthenticated } from '../../auth';

// Create order
export const createOrder = async (orderData) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const formData = new URLSearchParams();
  formData.append('transaction_id', orderData.transaction_id);
  formData.append('amount', orderData.amount);
  formData.append('products', orderData.products);
  
  // Add delivery address fields if available
  if (orderData.delivery_name) formData.append('delivery_name', orderData.delivery_name);
  if (orderData.delivery_phone) formData.append('delivery_phone', orderData.delivery_phone);
  if (orderData.delivery_address_line_1) formData.append('delivery_address_line_1', orderData.delivery_address_line_1);
  if (orderData.delivery_address_line_2) formData.append('delivery_address_line_2', orderData.delivery_address_line_2);
  if (orderData.delivery_city) formData.append('delivery_city', orderData.delivery_city);
  if (orderData.delivery_state) formData.append('delivery_state', orderData.delivery_state);
  if (orderData.delivery_postal_code) formData.append('delivery_postal_code', orderData.delivery_postal_code);
  if (orderData.delivery_country) formData.append('delivery_country', orderData.delivery_country);

  const response = await fetch(`${API}/order/add/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });

  const data = await response.json();
  return data;
};

// Get all orders for a user
export const getOrders = async () => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/order/?user=${authData.user.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authData.token}`,
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
};

// Get single order
export const getOrder = async (orderId) => {
  const response = await fetch(`${API}/order/${orderId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return await response.json();
};