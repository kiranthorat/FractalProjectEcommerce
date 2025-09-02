import { API } from '../../backend';
import { isAuthenticated } from '../../auth';

// Get all addresses for user
export const getUserAddresses = async () => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/address/get/${authData.user.id}/${authData.token}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to get addresses');
  }

  return data.addresses || [];
};

// Add new address
export const addAddress = async (addressData) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/address/add/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addressData)
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to add address');
  }

  return data.address;
};

// Update existing address
export const updateAddress = async (addressId, addressData) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/address/update/${authData.user.id}/${authData.token}/${addressId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addressData)
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to update address');
  }

  return data.address;
};

// Delete address
export const deleteAddress = async (addressId) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/address/delete/${authData.user.id}/${authData.token}/${addressId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete address');
  }

  return data;
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/address/set-default/${authData.user.id}/${authData.token}/${addressId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to set default address');
  }

  return data.address;
};
