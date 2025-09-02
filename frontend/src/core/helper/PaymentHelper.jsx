import { API } from '../../backend';
import { isAuthenticated } from '../../auth';

// Get Braintree client token
export const getClientToken = async () => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/payment/gettoken/${authData.user.id}/${authData.token}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to get client token');
  }

  return data.clientToken;
};

// Process payment with backend
export const processPayment = async (paymentData) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/payment/process-simple/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: paymentData.amount,
      paymentMethodNonce: paymentData.paymentMethodNonce || 'fake-nonce'
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Payment processing failed');
  }

  return {
    success: true,
    transaction_id: data.transaction.id,
    amount: data.transaction.amount,
    message: 'Payment processed successfully'
  };
};

// Validate payment data
export const validatePaymentData = (paymentData) => {
  const errors = {};
  
  if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
    errors.cardNumber = 'Card number must be at least 16 digits';
  }
  
  if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
    errors.expiryDate = 'Expiry date must be in MM/YY format';
  }
  
  if (!paymentData.cvv || paymentData.cvv.length < 3) {
    errors.cvv = 'CVV must be at least 3 digits';
  }
  
  if (!paymentData.cardHolderName) {
    errors.cardHolderName = 'Card holder name is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// For Braintree integration (when you have credentials)
export const processBraintreePayment = async (paymentData) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/payment/process/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: paymentData.amount,
      paymentMethodNonce: paymentData.paymentMethodNonce
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Payment processing failed');
  }

  return {
    success: true,
    transaction_id: data.transaction.id,
    amount: data.transaction.amount,
    message: 'Payment processed successfully'
  };
};