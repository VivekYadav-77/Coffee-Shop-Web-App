import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../utils/api";
import { KeyRound, Eye, EyeOff } from "lucide-react";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    code: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Resetting...");
    try {
      const response = await authApi.resetPassword(
        formData.email,
        formData.code,
        formData.password
      );
      setMessage(response.message + " Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-violet-900 to-indigo-900 flex items-center justify-center text-white">
      <div className="max-w-md w-full text-center p-8">
        <KeyRound size={48} className="mx-auto text-orange-700 mb-4" />
        <h1 className="text-3xl font-bold">Set a New Password</h1>
        <p className="text-slate-400 mt-2 mb-6">
          Enter the code from your email and your new password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your email"
            required
            className="w-full bg-slate-800 p-3 rounded-lg"
          />
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="6-digit code"
            maxLength="6"
            required
            className="w-full bg-slate-800 p-3 rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="New password"
              required
              className="w-full bg-slate-800 p-3 rounded-lg pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-700 text-black font-bold py-3 rounded-lg"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-green-300">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
