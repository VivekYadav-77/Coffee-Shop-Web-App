import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginFailure } from "../redux/slices/userSlice.js";
import { authApi } from "../utils/api.js";
import { Coffee, Eye, EyeOff, ArrowBigLeft } from "lucide-react";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      dispatch(loginFailure({ signup: "Please fill in all fields" }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      dispatch(loginFailure({ signup: "Passwords do not match" }));
      return false;
    }
    return true;
  };
  const handleLinkClick = () => {
    dispatch(loginFailure(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loginStart());
    try {
      const response = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/verify-code", { state: { email: formData.email } });
    } catch (err) {
      console.error("5. API call failed with error:", err);

      dispatch(
        loginFailure({ signup: err.message } || { signup: "login failed" })
      );
    }
  };
  const handlereturntohome = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-product-detail pt-32">
      <div className="max-w-4xl w-full mx-auto flex rounded-2xl overflow-hidden shadow-2xl bg-black/20 border border-white/15 backdrop-blur-xl">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 text-white">
          <div className="text-center mb-6">
            <div className="flex justify-evenly items-center">
              <Coffee size={40} className="text-red-400" />
              <h2 className="font-extrabold text-2xl tracking-wider">
                The Roasting House
              </h2>
            </div>{" "}
            <div className="flex justify-evenly items-center">
              <button onClick={handlereturntohome}>
                <ArrowBigLeft icon={15} /> Back{" "}
              </button>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Join The Roasting House
          </h2>
          <p className="text-white/80 mb-8">
            Create an account to start your coffee journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error?.signup && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center text-sm text-white">
                {error.signup}
              </div>
            )}
            <div>
              <label className="block mb-2 font-medium text-white/90">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
                className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors focus:border-red-400 focus:ring-0"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white/90">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors focus:border-red-400 focus:ring-0"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors focus:border-red-400 focus:ring-0"
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
            <div>
              <label className="block mb-2 font-medium text-white/90">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 rounded-lg border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors focus:border-red-400 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 mt-4 font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-white/70">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="font-semibold text-red-400 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Visual Section */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative bg-black/20 p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,69,19,0.15),transparent_70%)]"></div>
          <div className="relative text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-40 rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.2),transparent_70%)] opacity-0 animate-steam"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-40 rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.2),transparent_70%)] opacity-0 animate-steam [animation-delay:0.5s]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-40 rounded-[50%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.2),transparent_70%)] opacity-0 animate-steam [animation-delay:1s]"></div>
            <span className="text-8xl animate-float drop-shadow-2xl">☕</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
