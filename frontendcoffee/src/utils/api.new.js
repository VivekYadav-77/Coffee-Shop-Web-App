import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

// Auto-refresh on 401
API.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await API.post("/auth/refresh");
                return API(originalRequest);
            } catch {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

// ── Auth ──
export const authApi = {
    login: async (credentials) => {
        const res = await API.post("/auth/login", credentials);
        return res.data;
    },
    signup: async (userData) => {
        const res = await API.post("/auth/signup", userData);
        return res.data;
    },
    verifyEmailCode: async (email, code) => {
        const res = await API.post("/auth/verify-code", { email, code });
        return res.data;
    },
    resendVerification: async (email) => {
        const res = await API.post("/auth/resend-verification", { email });
        return res.data;
    },
    logout: async () => {
        const res = await API.get("/auth/logout");
        return res.data;
    },
    getMe: async () => {
        const res = await API.get("/auth/me");
        return res.data;
    },
    updateProfile: async (data) => {
        const res = await API.put("/auth/profile", data);
        return res.data;
    },
    changePassword: async (data) => {
        const res = await API.put("/auth/change-password", data);
        return res.data;
    },
    forgotPassword: async (email) => {
        const res = await API.post("/auth/forgot-password", { email });
        return res.data;
    },
    resetPassword: async (email, code, password) => {
        const res = await API.put("/auth/reset-password", { email, code, password });
        return res.data;
    },
    refreshToken: async () => {
        const res = await API.post("/auth/refresh");
        return res.data;
    },
};

// ── Vendors ──
export const vendorApi = {
    list: async (params = {}) => {
        const res = await API.get("/vendors", { params });
        return res.data;
    },
    getById: async (id) => {
        const res = await API.get(`/vendors/${id}`);
        return res.data;
    },
    getMenu: async (vendorId, params = {}) => {
        const res = await API.get(`/vendors/${vendorId}/menu`, { params });
        return res.data;
    },
    register: async (data) => {
        const res = await API.post("/vendors/register", data);
        return res.data;
    },
    updateProfile: async (formData) => {
        const res = await API.put("/vendors/profile", formData);
        return res.data;
    },
    toggleStatus: async () => {
        const res = await API.patch("/vendors/toggle-status");
        return res.data;
    },
    approve: async (vendorId, approved) => {
        const res = await API.patch(`/vendors/${vendorId}/approve`, { approved });
        return res.data;
    },
    adminList: async () => {
        const res = await API.get("/vendors/admin/all");
        return res.data;
    },
};

// ── Products ──
export const productsApi = {
    getAll: async (params = {}) => {
        const res = await API.get("/products", { params });
        return res.data;
    },
    getById: async (id) => {
        const res = await API.get(`/products/${id}`);
        return res.data;
    },
    create: async (formData) => {
        const res = await API.post("/products", formData);
        return res.data;
    },
    update: async (id, formData) => {
        const res = await API.put(`/products/${id}`, formData);
        return res.data;
    },
    delete: async (id) => {
        const res = await API.delete(`/products/${id}`);
        return res.data;
    },
    toggleStock: async (id) => {
        const res = await API.patch(`/products/${id}/toggle-stock`);
        return res.data;
    },
    submitReview: async (id, reviewData) => {
        const res = await API.post(`/products/${id}/reviews`, reviewData);
        return res.data;
    },
};

// ── Orders ──
export const ordersApi = {
    place: async (orderData) => {
        const res = await API.post("/orders", orderData);
        return res.data;
    },
    getMyOrders: async (params = {}) => {
        const res = await API.get("/orders/my-orders", { params });
        return res.data;
    },
    cancel: async (orderId, reason) => {
        const res = await API.patch(`/orders/${orderId}/cancel`, { reason });
        return res.data;
    },
    // Vendor
    getVendorOrders: async (params = {}) => {
        const res = await API.get("/orders/vendor-orders", { params });
        return res.data;
    },
    vendorAccept: async (orderId) => {
        const res = await API.patch(`/orders/${orderId}/vendor-accept`);
        return res.data;
    },
    vendorPrepare: async (orderId) => {
        const res = await API.patch(`/orders/${orderId}/vendor-prepare`);
        return res.data;
    },
    vendorReady: async (orderId) => {
        const res = await API.patch(`/orders/${orderId}/vendor-ready`);
        return res.data;
    },
    vendorCancel: async (orderId, reason) => {
        const res = await API.patch(`/orders/${orderId}/vendor-cancel`, { reason });
        return res.data;
    },
    // Agent
    getAgentDashboard: async () => {
        const res = await API.get("/orders/agent-dashboard");
        return res.data;
    },
    agentAccept: async (orderId) => {
        const res = await API.patch(`/orders/${orderId}/agent-accept`);
        return res.data;
    },
    agentLocation: async (data) => {
        const res = await API.post("/orders/agent-location", data);
        return res.data;
    },
    agentDeliver: async (orderId, otp) => {
        const res = await API.patch(`/orders/${orderId}/deliver`, { otp });
        return res.data;
    },
    getRoute: async (orderId, agentLat, agentLng) => {
        const res = await API.get(`/orders/${orderId}/route`, { params: { agentLat, agentLng } });
        return res.data;
    },
    // Admin
    adminGetAll: async (params = {}) => {
        const res = await API.get("/orders/admin/all", { params });
        return res.data;
    },
    updateStatus: async (orderId, status) => {
        const res = await API.patch(`/orders/${orderId}/status`, { status });
        return res.data;
    },
};

// ── Cart ──
export const cartApi = {
    get: async (vendor) => {
        const res = await API.get("/cart", { params: { vendor } });
        return res.data;
    },
    add: async (productId, quantity, vendorId) => {
        const res = await API.post("/cart/add", { productId, quantity, vendorId });
        return res.data;
    },
    update: async (productId, quantity, vendorId) => {
        const res = await API.put("/cart/update", { productId, quantity, vendorId });
        return res.data;
    },
    remove: async (productId, vendorId) => {
        const res = await API.delete(`/cart/remove/${productId}`, { params: { vendorId } });
        return res.data;
    },
    clear: async (vendorId) => {
        const res = await API.delete("/cart/clear", { params: { vendorId } });
        return res.data;
    },
};

// ── Disputes ──
export const disputeApi = {
    raise: async (data) => {
        const res = await API.post("/disputes", data);
        return res.data;
    },
    getMine: async () => {
        const res = await API.get("/disputes/my-disputes");
        return res.data;
    },
    getAll: async (params = {}) => {
        const res = await API.get("/disputes/all", { params });
        return res.data;
    },
    getById: async (id) => {
        const res = await API.get(`/disputes/${id}`);
        return res.data;
    },
    resolve: async (id, data) => {
        const res = await API.patch(`/disputes/${id}/resolve`, data);
        return res.data;
    },
};

// ── Wallet ──
export const walletApi = {
    getBalance: async () => {
        const res = await API.get("/wallet/balance");
        return res.data;
    },
    topUp: async (amount) => {
        const res = await API.post("/wallet/topup", { amount });
        return res.data;
    },
    getHistory: async (params = {}) => {
        const res = await API.get("/wallet/history", { params });
        return res.data;
    },
};

// ── Analytics ──
export const analyticsApi = {
    admin: async () => {
        const res = await API.get("/analytics/admin");
        return res.data;
    },
    vendor: async () => {
        const res = await API.get("/analytics/vendor");
        return res.data;
    },
    agent: async () => {
        const res = await API.get("/analytics/agent");
        return res.data;
    },
};

// ── Coupons ──
export const couponsApi = {
    getMine: async () => {
        const res = await API.get("/coupons/my-coupons");
        return res.data;
    },
    spin: async () => {
        const res = await API.post("/coupons/spin");
        return res.data;
    },
    apply: async (couponCode, cartTotal) => {
        const res = await API.post("/coupons/apply", { couponCode, cartTotal });
        return res.data;
    },
};

// ── Chatbot ──
export const chatbotApi = {
    send: async (message, history = []) => {
        const formattedHistory = history
            .filter((m) => m.role !== "system")
            .map((msg) => ({
                role: msg.role === "bot" ? "model" : "user",
                parts: [{ text: msg.text }],
            }));
        const res = await API.post("/bot/chat", { message, history: formattedHistory });
        return res.data;
    },
};

export { API };
