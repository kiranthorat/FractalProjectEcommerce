import { API } from '../../backend';
import { isAuthenticated } from '../../auth';

// Update user profile
export const updateUserProfile = async (userData) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/user/update/${authData.user.id}/${authData.token}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to update profile');
  }

  return data.user;
};

// Get user profile
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API}/user/${userId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Failed to get profile');
  }

  return data;
};
