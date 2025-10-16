# ☕ Coffee Shop Web Application

A full-stack **Coffee Shop Web Application** built using the **MERN Stack (MongoDB, Express, React, Node.js)** with **Redux** for global state management.  
This platform allows customers to explore coffee products, manage carts, and place orders online — while admins can easily handle menu, inventory, and order analytics through a responsive dashboard.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- **React.js (Vite)**
- **Redux Toolkit** – State management
- **React Router DOM** – Client-side routing
- **Axios** – API communication
- **Tailwind CSS** – Modern responsive styling
- **React Icons** – Icons and UI elements

### ⚙️ Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Bcrypt.js** – Password hashing
- **Multer** – Image uploads
- **Stripe / Razorpay** – Online payments(Releasing Soon)

### 🧰 Dev Tools
- Git & GitHub (Version Control)
- Postman (API Testing)
- ESLint + Prettier (Code formatting)

---

## 🧠 Features

### 👨‍💻 User Side
- 🔐 User authentication with JWT
- ☕ Browse and search coffee menu
- 🛒 Add to Cart, Update, and Remove Items
- 💳 Secure online checkout (Stripe/Razorpay)
- 📦 Order tracking & order history
- 📱 Fully responsive UI

### 🧑‍💼 Admin Side
- 🔒 Admin authentication & dashboard
- 📋 Add, Edit, Delete coffee products
- 🧾 Manage orders and update status
- 📊 Sales analytics and daily reports
- 🖼️ Upload product images via Cloudinary

---

## 🏗️ Folder Structure

coffee-shop/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── app/
│ │ ├── components/
│ │ ├── features/
│ │ ├── pages/
│ │ ├── assets/
│ │ └── App.jsx
│ ├── index.html
│ └── package.json
│
├── .env
├── .gitignore
├── package.json
└── README.md

