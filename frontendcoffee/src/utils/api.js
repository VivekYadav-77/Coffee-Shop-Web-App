// API utility functions for backend integration
// TODO: Connect with Express backend API
import axios from "axios";
console.log("API URL:", import.meta.env.VITE_API_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Products API

export const productsApi = {
  // TODO: Implement actual API calls
  getAllProducts: async () => {
    // TODO: Replace with actual API call
    try {
      const res = await API.get("/products");
      console.log("response from the api", res.data);
      return res.data;
    } catch (err) {
      console.error("API Error:", err);
      throw err;
    }
  },
  getProductById: async (id) => {
    const res = await API.get(`/products/${id}`);
    console.log("res from the prodid", res);
    return res.data.product;
  },
  submitReview: async (productId, reviewData) => {
    const res = await API.post(
      `/productreview/${productId}/reviews`,
      reviewData
    );
    return res.data;
  },
};

//Admin Priviliage API

export const adminApi = {
  getAllProducts: async () => {
    try {
      const res = await API.get("/products");
      console.log("response from the adminapi", res.data);
      return res.data;
    } catch (err) {
      console.error("API from the adminError:", err);
      if (err.response) {
        return err.response.data;
      }
      throw new Error("An unexpected error occurred");
    }
  },
  getProductById: async (id) => {
    const res = await API.get(`/products/${id}`);
    console.log("res from the prodid", res);
    return res.data.product;
  },
  create: async (formData) => {
    console.log("hello from api create", formData);
    console.log("Verifying FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, ":", value);
    }
    const response = await API.post("/admin/products", formData);
    return response.data;
  },
  update: async (productId, formData) => {
    const response = await API.put(`/admin/products/${productId}`, formData);
    return response.data;
  },
  delete: async (productId) => {
    const response = await API.delete(`admin/products/${productId}`);
    return response.data;
  },
  toggleStock: async (productId) => {
    const response = await API.patch(
      `/admin/products/${productId}/toggle-stock`
    );
    return response.data;
  },
};
//Cupon API
export const couponsApi = {
  applyCoupon: async (couponCode, cartTotal) => {
    const res = await API.post("/coupons/apply", { couponCode, cartTotal });
    return res.data;
  },
  spinWheel: async () => {
    const res = await API.post("/coupons/spin");
    return res.data;
  },

  getMyCoupons: async () => {
    const res = await API.get("/coupons/my-coupons");
    return res.data;
  },
};

// User Authentication API

export const authApi = {
  login: async (credentials) => {
    try {
      console.log(credentials);
      const res = await API.post("/auth/login", credentials);
      console.log("from login", res);
      return res.data.user;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "login failed");
    }
  },

  signup: async (userData) => {
    try {
      const res = await API.post("/auth/signup", userData);

      console.log("getting the res form the signup ", res);
      return res.data.user;
    } catch (error) {
      console.log("error ", error.response.data);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Signup failed");
    }
  },
  verifyEmailCode: async (email, code) => {
    const res = await API.post("/auth/verify-code", { email, code });
    console.log("resfrom the ve", res);
    return res.data;
  },
  resendVerificationEmail: async (email) => {
    const res = await API.post("/auth/resend-verification", { email });
    return res.data;
  },
  logout: async () => {
    const res = await API.get("/auth/logout");
    console.log("from the logout", res);
    console.log("TODO: Implement logout API call");
    return Promise.resolve();
  },
  updateProfile: async (userData) => {
    const res = await API.put("/auth/profile", userData);
    return res.data;
  },
  changePassword: async (passwordData) => {
    const res = await API.put("/auth/change-password", passwordData);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await API.post("/auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (email, code, password) => {
    const res = await API.put(`/auth/reset-password`, {
      email,
      code,
      password,
    });
    return res.data;
  },
};
//chatbot Api
export const chatbotApi = {
  sendMessage: async (message, history) => {
    const historyForApi =
      history.length > 0 && history[0].role === "bot"
        ? history.slice(1)
        : history;
    const formattedHistory = historyForApi.map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const res = await API.post("/bot/chat", {
      message: message,
      history: formattedHistory,
    });
    return res.data;
  },
};

// Orders API

export const ordersApi = {
  placeOrder: async (orderData) => {
    // TODO: Replace with actual API call

    const res = await API.post("/orders", orderData);
    console.log("placeorder", res);
    return res.data;
  },

  customerOrders: async (userId) => {
    // TODO: Replace with actual API call
    const res = await API.get(`/orders/customer/${userId}`);
    console.log("customerorder", res);

    return res.data;
  },
  adminOrders: async () => {
    // TODO: Replace with actual API call
    const res = await API.get("/orders/admin");
    console.log("adminorders", res.data);

    return res.data;
  },
  agentOrders: async (agentId) => {
    // TODO: Replace with actual API call
    const res = await API.get(`/orders/agent/dashboard/${agentId}`);
    console.log("agentorders", res);

    return res.data;
  },
  acceptOrders: async (orderId, agentId) => {
    // TODO: Replace with actual API call
    console.log(orderId, agentId);
    const res = await API.patch(`/orders/${orderId}/accept`, { agentId });
    console.log("res", res);
    console.log("acceptorderfromapi", res.data);
    return res.data;
  },
  updateOrderStatus: async (orderId, status, otp = null) => {
    // TODO: Replace with actual API call
    const res = await API.patch(`/orders/${orderId}/status`, { status, otp });
    console.log("updateorderstatus", res);
    return res.data;
  },
  updateAgentLocation: (orderId, locationData) =>
    API.patch(`/orders/${orderId}/location`, locationData),
  getDeliveryRoute: async (orderId, agentLocation) => {
    const res = await API.get(
      `/orders/${orderId}/route?agentLat=${agentLocation.lat}&agentLng=${agentLocation.lng}`
    );
    return res.data;
  },
  customerOrders: async (userId, filter = {}) => {
    let queryString = "";
    if (filter.start && filter.end) {
      queryString = `?startDate=${filter.start}&endDate=${filter.end}`;
    }
    const res = await API.get(`/orders/customer/${userId}${queryString}`);
    return res.data;
  },
};
//analytic Api
export const analyticApi = {
  getAdminAnalytics: async () => {
    const res = await API.get("/analytics/admin");
    return res.data;
  },
  getAdminOrderHistory: async (page = 0) => {
    const res = await API.get(`/orders/admin/history?page=${page}`);
    return res.data;
  },
  getAgentAnalytics: async (agentId) => {
    const res = await API.get(`/analytics/agent/${agentId}`);
    return res.data;
  },
};

//Cart Api
export const cartApi = {
  getCart: async () => {
    const res = await API.get("/cart");
    return res.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const res = await API.post("/cart/add", { productId, quantity });
    return res.data;
  },
  updateQuantity: async (productId, quantity) => {
    const res = await API.put("/cart/update", { productId, quantity });
    return res.data;
  },
  removeFromCart: async (productId) => {
    const res = await API.delete(`/cart/remove/${productId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await API.delete("/cart/clear");
    return res.data;
  },
};

export { API };
