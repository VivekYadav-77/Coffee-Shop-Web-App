import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./redux/slices/userSlice.js";
import {
  clearCart,
  addToCart,
  syncCartItem,
} from "./redux/slices/cartSlice.js";
import { updateOrAddOrder } from "./redux/slices/orderSlice.js";
import {
  setMenuItems,
  setMenuError,
  addMenuItem,
  updateMenuItemState,
  removeMenuItem,
} from "./redux/slices/menuSlice.js";
import { API } from "./utils/api.js";
import { socket } from "./utils/socket.js";
import { cartApi, productsApi } from "./utils/api.js";

import MainLayout from "./components/MainLayout.jsx";

// Existing pages
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
import SpaceNotFound from "./pages/PageNotFound.jsx";

// New feature pages (lazy loaded)
const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard.jsx"));
const VendorsListing = lazy(() => import("./pages/vendor/VendorsListing.jsx"));
const VendorStorefront = lazy(() => import("./pages/vendor/VendorStorefront.jsx"));
const MyDisputes = lazy(() => import("./pages/disputes/MyDisputes.jsx"));
const RaiseDispute = lazy(() => import("./pages/disputes/RaiseDispute.jsx"));
const AdminDisputes = lazy(() => import("./pages/disputes/AdminDisputes.jsx"));
const WalletPage = lazy(() => import("./pages/wallet/WalletPage.jsx"));

const PageLoader = () => (
  <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#6b4226] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await API.get("/auth/me", { withCredentials: true });
        dispatch(loginSuccess(res.data.user));
      } catch (err) {
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
      .catch((error) => {
        console.error("Failed to pre-load menu:", error);
        dispatch(setMenuError());
      });
  }, [dispatch]);

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user.role === "CUSTOMER") {
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
                inStock: item.productId.inStock,
                quantity: item.quantity,
              }),
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
      } else if (user.role === "VENDOR") {
        socket.emit("join_room", `vendor_${user.vendorProfile}`);
      }

      const handleOrderUpdate = (order) => dispatch(updateOrAddOrder(order));
      const handleProductUpdate = (product) => dispatch(updateMenuItemState(product));
      const handleProductAdd = (product) => dispatch(addMenuItem(product));
      const handleProductDelete = (productId) => dispatch(removeMenuItem(productId));

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
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Existing Routes */}
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
          <Route path="/Contactform" element={<Contactform />} />
          <Route path="/please-verify" element={<PleaseVerifyPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ── New Multi-Vendor Routes ── */}
          <Route path="/vendors" element={<VendorsListing />} />
          <Route path="/vendor/:id" element={<VendorStorefront />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />

          {/* ── Dispute Routes ── */}
          <Route path="/raise-dispute" element={<RaiseDispute />} />
          <Route path="/my-disputes" element={<MyDisputes />} />
          <Route path="/admin/disputes" element={<AdminDisputes />} />

          {/* ── Wallet Route ── */}
          <Route path="/wallet" element={<WalletPage />} />
        </Route>
        <Route path="*" element={<SpaceNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

