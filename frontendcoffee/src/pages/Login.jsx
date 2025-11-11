import { useState ,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Coffee, Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/userSlice.js";
import { authApi } from "../utils/api.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [showResendLink, setShowResendLink] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  useEffect(() => {
    dispatch(loginFailure(null));
  }, [dispatch]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setShowResendLink(false);
    setResendMessage("");
    dispatch(loginFailure(null));
  };
  const handleLinkClick = () => {
    dispatch(loginFailure(null));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      dispatch(loginFailure({ login: "Please fill in all fields" }));
      return;
    }
    dispatch(loginStart());
    try {
      const response = await authApi.login(formData);
      dispatch(loginSuccess(response));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";

      console.error("Login API failed:", errorMessage);

      dispatch(loginFailure({ login: errorMessage }));

      if (errorMessage.includes("Please verify your email")) {
        setShowResendLink(true);
      }
    }
  };
  const handleResendVerification = async () => {
    setResendMessage("Sending...");
    try {
      const response = await authApi.resendVerificationEmail(formData.email);
      setResendMessage(response.message);
      setTimeout(() => {
        navigate("/verify-code", { state: { email: formData.email } });
      }, 1500)
    } catch (err) {
      setResendMessage(err.response?.data?.message || "Failed to send email.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-product-detail pt-24">
      <div className="max-w-4xl w-full mx-auto flex rounded-2xl overflow-hidden shadow-2xl bg-black/20 border border-white/15 backdrop-blur-xl">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 text-white">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <Coffee size={40} className="text-red-400" />
              <h2 className="font-extrabold text-2xl tracking-wider">
                The Roasting House
              </h2>
            </Link>
          </div>

          <h3 className="text-3xl font-bold text-center mb-2">Welcome Back!</h3>
          <p className="text-white/80 text-center mb-6">
            Sign in to continue your coffee journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error?.login && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center text-sm text-white">
                {error.login}
              </div>
            )}
            <div>
              <label className="block mb-2 font-medium text-white/90">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full p-3 pl-12 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors focus:border-red-400 focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full p-3 pl-12 pr-12 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors focus:border-red-400 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-red-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 mt-4 font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          {showResendLink && (
            <div className="mt-4 text-center bg-red-900/50 border border-red-500 p-4 rounded-lg">
              <p className="text-red-300">{error?.login}</p>
              <button
                onClick={handleResendVerification}
                className="text-yellow-400 font-semibold hover:underline mt-2"
              >
                Resend verification email
              </button>
              {resendMessage && (
                <p className="text-green-300 text-sm mt-2">{resendMessage}</p>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-white/70">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                onClick={handleLinkClick}
                className="font-semibold text-red-400 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Visual Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative bg-black/20 p-12 bg-[radial-gradient(circle,rgba(139,69,19,0.1),transparent_70%)]">
          <span className="text-8xl animate-float drop-shadow-2xl">☕</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
