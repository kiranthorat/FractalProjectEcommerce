import { API } from '../../backend';
import { isAuthenticated } from '../../auth';

// Backend Cart Functions (NEW - using Django API)
export const getCartFromBackend = async () => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  console.log('Auth data:', authData); // Debug log

  const url = `${API}/cart/get/${authData.user.id}/${authData.token}/`;
  console.log('Fetching cart from:', url); // Debug log

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  console.log('Response status:', response.status); // Debug log
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Backend error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Cart data:', data); // Debug log
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to get cart');
  }

  return data.cart;
};

export const addItemToCartBackend = async (productId, quantity = 1) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/cart/add/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to add item to cart');
  }

  return data;
};

export const removeItemFromCartBackend = async (productId) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/cart/remove/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to remove item from cart');
  }

  return data;
};

export const updateCartItemBackend = async (productId, quantity) => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/cart/update/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity
    })
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to update cart item');
  }

  return data;
};

export const clearCartBackend = async () => {
  const authData = isAuthenticated();
  if (!authData) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API}/cart/clear/${authData.user.id}/${authData.token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to clear cart');
  }

  return data;
};

// Local Storage Cart Functions (UPDATED - with quantity support)
export const addItemToCart = (item, next) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
      cart[existingItemIndex].total_price = (cart[existingItemIndex].quantity * parseFloat(cart[existingItemIndex].price)).toFixed(2);
    } else {
      // Item doesn't exist, add with quantity 1
      cart.push({
        ...item,
        quantity: 1,
        total_price: parseFloat(item.price).toFixed(2)
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

export const loadCart = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
};

export const removeItemFromCart = (productId) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    cart = cart.filter(product => product.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));
  }
  return cart;
};

// Update item quantity in localStorage
export const updateItemQuantityInCart = (productId, quantity) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(itemIndex, 1);
      } else {
        // Update quantity and total price
        cart[itemIndex].quantity = quantity;
        cart[itemIndex].total_price = (quantity * parseFloat(cart[itemIndex].price)).toFixed(2);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  return cart;
};

// Decrease item quantity in localStorage
export const decreaseItemQuantityInCart = (productId) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex >= 0) {
      const currentQuantity = cart[itemIndex].quantity || 1;
      if (currentQuantity > 1) {
        // Decrease quantity
        cart[itemIndex].quantity = currentQuantity - 1;
        cart[itemIndex].total_price = (cart[itemIndex].quantity * parseFloat(cart[itemIndex].price)).toFixed(2);
      } else {
        // Remove item if quantity would be 0
        cart.splice(itemIndex, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  return cart;
};

export const cartEmpty = (next) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
    let cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

// Hybrid Cart Functions (NEW - combines both approaches)
export const addToCart = async (product, next) => {
  console.log('Adding product to cart:', product); // Debug log
  
  if (isAuthenticated()) {
    // User is logged in - use backend
    try {
      console.log('Using backend cart for product ID:', product.id); // Debug log
      await addItemToCartBackend(product.id, 1);
      next();
    } catch (error) {
      console.error('Backend cart failed, falling back to localStorage:', error);
      addItemToCart(product, next);
    }
  } else {
    // User not logged in - use localStorage
    console.log('Using localStorage cart'); // Debug log
    addItemToCart(product, next);
  }
};

export const getCart = async () => {
  if (isAuthenticated()) {
    // User is logged in - use backend
    try {
      const cart = await getCartFromBackend();
      console.log('Raw cart from backend:', cart); // Debug log
      
      // Transform backend cart items to match localStorage format
      const cartItems = cart.items ? cart.items.map(item => ({
        id: item.product_id,
        name: item.product_name,
        description: item.product_description,
        price: item.product_price,
        image: item.product_image,
        quantity: item.quantity,
        total_price: item.total_price
      })) : [];
      
      console.log('Transformed cart items:', cartItems); // Debug log
      return cartItems;
    } catch (error) {
      console.error('Backend cart failed, falling back to localStorage:', error);
      return loadCart();
    }
  } else {
    // User not logged in - use localStorage
    return loadCart();
  }
};

export const removeFromCart = async (productId, next) => {
  if (isAuthenticated()) {
    // User is logged in - use backend
    try {
      await removeItemFromCartBackend(productId);
      next();
    } catch (error) {
      console.error('Backend cart failed, falling back to localStorage:', error);
      removeItemFromCart(productId);
      next();
    }
  } else {
    // User not logged in - use localStorage
    removeItemFromCart(productId);
    next();
  }
};

export const clearCart = async (next) => {
  if (isAuthenticated()) {
    // User is logged in - use backend
    try {
      await clearCartBackend();
      next();
    } catch (error) {
      console.error('Backend cart failed, falling back to localStorage:', error);
      cartEmpty(next);
    }
  } else {
    // User not logged in - use localStorage
    cartEmpty(next);
  }
};

// Update cart item quantity (hybrid)
export const updateCartItemQuantity = async (productId, quantity, next) => {
  if (isAuthenticated()) {
    // User is logged in - use backend
    try {
      await updateCartItemBackend(productId, quantity);
      next();
    } catch (error) {
      console.error('Backend cart failed, falling back to localStorage:', error);
      updateItemQuantityInCart(productId, quantity);
      next();
    }
  } else {
    // User not logged in - use localStorage
    updateItemQuantityInCart(productId, quantity);
    next();
  }
};

// Decrease cart item quantity (hybrid)
export const decreaseCartItemQuantity = async (productId, next) => {
  if (isAuthenticated()) {
    // User is logged in - get current quantity first, then update
    try {
      const cart = await getCartFromBackend();
      const item = cart.items?.find(item => item.product_id === productId);
      if (item) {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
          await updateCartItemBackend(productId, newQuantity);
        } else {
          await removeItemFromCartBackend(productId);
        }
      }
      next();
    } catch (error) {
      console.error('Backend cart failed, falling back to localStorage:', error);
      decreaseItemQuantityInCart(productId);
      next();
    }
  } else {
    // User not logged in - use localStorage
    decreaseItemQuantityInCart(productId);
    next();
  }
};