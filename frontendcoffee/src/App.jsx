import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import MenuManagement from "./pages/Menumanagement.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import MyOrders from "./pages/CustomerOrder.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import AdminAnalytics from "./pages/AdminAnalytic.jsx";
import { loginSuccess, logout } from "./redux/slices/userSlice.js";
import {
  clearCart,
  addToCart,
  syncCartItem,
} from "./redux/slices/cartSlice.js";
import { updateOrAddOrder } from "./redux/slices/orderSlice.js";
import { API, cartApi, productsApi } from "./utils/api.js";
import { socket } from "./utils/socket.js";
import {
  setMenuItems,
  addMenuItem,
  updateMenuItemState,
  removeMenuItem,
} from "./redux/slices/menuSlice.js";

import AdminOrderHistory from "./pages/AdminOrderHistory.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import Chatbot from "./pages/ChatBot.jsx";
import MenuPage from "./pages/MenuSearchPage.jsx";
import ProfilePage from "./pages/Profilepage.jsx";
import SpinWheelGame from "./pages/SpinWheelGame.jsx";
import MyCouponsPage from "./pages/Mycoupons.jsx";
import Contactform from "./pages/form.jsx";
import PleaseVerifyPage from "./pages/PleaseVerifyEmail.jsx";
import VerifyCodePage from "./pages/VerifyCodePage.jsx";
import ForgotPasswordPage from "./pages/ForgotpasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await API.get("/auth/me", { withCredentials: true });
        dispatch(loginSuccess(res.data.user));
      } catch (err) {
        // navigate('/login') // Optional: only navigate if not already on a public page
        dispatch(logout());
      } finally {
        setIsVerifying(false);
      }
    };
    verifyUser();
  }, [dispatch]);
  useEffect(() => {
    productsApi
      .getAllProducts()
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          dispatch(setMenuItems(data.products));
        }
      })
      .catch((error) => console.error("Failed to pre-load menu:", error));
  }, [dispatch]);
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user.role == "CUSTOMER") {
        try {
          const cartData = await cartApi.getCart();
          dispatch(clearCart());
          cartData.items.forEach((item) => {
            dispatch(
              addToCart({
                _id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                imageUrl: item.productId.imageUrl,
                quantity: item.quantity,
              })
            );
          });

          const handleProductUpdate = (product) => {
            dispatch(updateMenuItemState(product));
            dispatch(syncCartItem(product));
          };
          socket.on("product_update", handleProductUpdate);
        } catch (err) {
          console.error("Failed to load cart:", err);
        }
      }
    };
    loadCart();
  }, [isAuthenticated, user, dispatch]);
  useEffect(() => {
    if (isAuthenticated && user) {
      const personalRoom = `${user.role.toLowerCase()}_${user._id}`;
      socket.emit("join_room", personalRoom);

      if (user.role === "ADMIN") {
        socket.emit("join_room", "admin_room");
      } else if (user.role === "AGENT") {
        socket.emit("join_room", "agent_room");
      }

      const handleOrderUpdate = (order) => dispatch(updateOrAddOrder(order));

      const handleProductUpdate = (product) => {

        dispatch(updateMenuItemState(product));
      };
      const handleProductAdd = (product) => dispatch(addMenuItem(product));
      const handleProductDelete = (productId) =>
        dispatch(removeMenuItem(productId));

      socket.on("order_update", handleOrderUpdate);
      socket.on("product_update", handleProductUpdate);
      socket.on("product_add", handleProductAdd);
      socket.on("product_delete", handleProductDelete);
      return () => {
        socket.off("order_update", handleOrderUpdate);
        socket.off("product_update", handleProductUpdate);
        socket.off("product_add", handleProductAdd);
        socket.off("product_delete", handleProductDelete);
      };
    }
  }, [isAuthenticated, user, dispatch]);
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading Application...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/menumanagement" element={<MenuManagement />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/admin/analytic" element={<AdminAnalytics />} />
          <Route path="/admin/history" element={<AdminOrderHistory />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/productsearch" element={<MenuPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/award" element={<SpinWheelGame />} />
          <Route path="/mycoupons" element={<MyCouponsPage />} />
          <Route path="/mycoupons" element={<MyCouponsPage />} />
          <Route path="/Contactform" element={<Contactform />} />
          <Route path="/please-verify" element={<PleaseVerifyPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route
            path="/verification-failed"
            element={<div>Verification Failed. Please try again.</div>}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
