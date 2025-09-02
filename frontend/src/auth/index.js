import { API } from '../backend';
// Signup helper
export const signup = (user) => {
  return fetch(`${API}/user/`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then((response) => response.json())
    .catch(err => console.log(err));
};

// Signin helper
export const signin = (user) => {
  const formData = new FormData();

  for (const name in user) {
    formData.append(name, user[name]);
  }

  return fetch(`${API}/user/login/`, {
    method: "POST",
    body: formData // Fixed: was FormData (constructor), should be formData (instance)
  })
    .then(response => response.json())
    .catch(err => console.log(err));
};

// Authenticate helper - store JWT token
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") { // Fixed: was ==, should be ===
    return false;
  }

  if (localStorage.getItem("jwt")) { // Fixed: was "jwet"
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

// Signout helper
export const signout = (next) => {
    const authData = isAuthenticated();
    const userId = authData && authData.user && authData.user.id;
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    
    // Import cartEmpty from cart helper
    const cartEmpty = (callback) => {
      localStorage.removeItem("cart");
      let cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      callback();
    };
    
    cartEmpty(() => {});

    return fetch(`${API}/user/logout/${userId}`, {
      method: "GET"
    })
      .then(response => {
        console.log("Signout success");
        next();
      })
      .catch(err => console.log(err));
  }
};