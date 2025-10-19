# The Roasting House ☕

**Live Demo:** [https://the-roasting-house.vercel.app/](https://the-roasting-house.vercel.app/)

A full-stack **Coffee Shop Web Application** built using the **MERN Stack (MongoDB, Express, React, Node.js)** with **Redux** for global state management.  
This platform allows customers to explore coffee products, manage carts, and place orders online — while admins can easily handle menu, inventory, and order analytics through a responsive dashboard.

---
## ✨ Key Features

This application is divided into three user experiences, each with its own set of features:

### 👤 Customer Features
* **Full E-commerce Flow:** Browse the menu, add items to the cart, apply coupons, and complete checkout.
* **Secure Authentication:** Full signup, login, and logout flow with JWT (Access & Refresh Tokens) stored in secure cookies.
* **Email Verification:** New users receive a 6-digit OTP to verify their email address before they can log in. Includes a "Resend Code" option.
* **Password Reset:** Secure "Forgot Password" flow using an email-based OTP.
* **Real-time Order Tracking:** A dedicated "My Orders" page with a live status tracker and an interactive map showing the delivery agent's location in real-time.
* **Ratings & Reviews:** Customers can submit star ratings and comments for products they have purchased.
* **Gamified Coupons:** A "Spin to Win" wheel game where users can win discount coupons.
* **AI Chatbot:** An integrated chatbot powered by the Gemini API to answer common questions.

### ⚙️ Admin Features
* **Admin Dashboard:** A central hub to view and manage all incoming live orders.
* **Menu Management (CRUD):** A full interface to add, view, update, and delete menu items, including image uploads.
* **Real-time Updates:** Any change made in the admin panel (e.g., marking an item "Out of Stock") is instantly broadcast to all connected users.
* **Order Management:** Admins can update the status of any order (e.g., from 'Confirmed' to 'Preparing').
* **Analytics Dashboard:** Visual charts and stats showing total revenue, number of orders, and other key metrics.
* **Order History:** A paginated and date-filterable view of all completed orders.

### 🛵 Agent Features
* **Agent Dashboard:** A dedicated view showing "Available for Delivery" jobs and the agent's "Active Deliveries".
* **Accept Orders:** Agents can accept available orders, which then get assigned to them.
* **Live Location Sharing:** The agent's browser uses the Geolocation API to send their GPS coordinates to the server every 15 seconds.
* **Route Mapping:** Agents can view a calculated path from their location to the customer's address on a map (powered by OpenRouteService).
* **OTP Delivery Confirmation:** Agents must enter a 4-digit OTP (provided by the customer) to securely mark an order as "Delivered".
---

## 🚀 Tech Stack

### 🖥️ Frontend
- **React.js (Vite)**
- **Redux Toolkit** – State management
- **React Router DOM** – Client-side routing
- **Axios** – API communication
- **Tailwind CSS** – Modern responsive styling
- **React-Leaflet** - Open-Source JavaScript library used for creating interactive web maps
- **Recharts** - It is a charting library for React used to build dynamic and interactive data visualizations
- **socket.io-client** - It is the client-side library that handles the bi-directional, real-time communication between your React application and a Socket.IO server
- **React-Custom-Roulette** - It help in creating a animated spinning wheel
- **Framer-Motion** - It is an open-source, production-ready motion library for React, designed to simplify the creation of animations and gestures in web applications.
- **React Icons** – Icons and UI elements

### ⚙️ Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Cookie-Parser**
- **Bcrypt.js** – Password hashing
- **Multer** – Image uploads
- **socket.io**
- **Stripe / Razorpay** – Online payments(Releasing Soon)
- ****External APIs:** Google Gemini, SendGrid (for emails), OpenRouteService (for mapping)
- **@google/generative-ai** - It is an official Google Node.js client library that lets developers access and interact with Google’s Gemini (Generative AI) models for text, image, and       chat generation.

### 🧰 Dev Tools
- Git & GitHub (Version Control)
- Postman (API Testing)
- ESLint + Prettier (Code formatting)
  
---

### Deployment
 - Vercel (Frontend), Render (Backend)
   
## 🚀 Getting Started

### Prerequisites
* Node.js v18.x or higher
* npm
* A MongoDB Atlas account
* API keys for SendGrid, Google Gemini, and OpenRouteService
### Backend Setup

1.  Clone the repository:
    ```bash
    git clone [https://github.com/VivekYadav-77/Coffee-Shop-App.git](https://github.com/VivekYadav-77/Coffee-Shop-Web-App.git)
    cd Coffee-Shop-Web-App/backendcoffee
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your environment variables:
    ```
    DATABASE_URL=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CORS_ORIGIN=http://localhost:5173
    SENDGRID_API_KEY=your_sendgrid_key
    EMAIL_USER=your_verified_sendgrid_email
    GEMINI_API_KEY=your_gemini_key
    OPENROUTESERVICE_KEY=your_ors_key
    ```
4.  Start the server:
    ```bash
    npm start
    ```

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontendcoffee
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your backend URL:
    ```
    VITE_API_URL=http://localhost:3000
    ```
4.  Start the client:
    ```bash
    npm run dev
    ```

---

## 🏗️ Folder Structure

Coffee-Shop_Web-App/
│
├── backendcoffee/
│ ├── config/
│ ├── connection/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── public/
│ ├── service/
│ └── coffeeserver.js
│
├── frontendcoffee/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── LocationData/
│ │ ├── pages/
│ │ ├── redux/
│ │ ├── utils/
│ │ ├── App.jsx/
│ │ ├── index.css/
│ │ └── main.jsx
│ ├── index.html
│ └── package.json
│
├── .env
├── .gitignore
├── package.json
└── README.md

