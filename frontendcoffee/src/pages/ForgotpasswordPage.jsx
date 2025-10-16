import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../utils/api";
import { Mail, ArrowLeft } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    authApi.forgotPassword(email).catch((err) => {
      console.error("Forgot password API failed:", err);
    });
    navigate("/reset-password", { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-violet-900 to-indigo-900 flex items-center justify-center text-white p-4">
      <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-lg shadow-lg">
        <Mail size={48} className="mx-auto text-orange-700 mb-4" />
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-slate-400 mt-2 mb-6">
          Enter your email and we'll send you a code to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            className="w-full bg-slate-700 p-3 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-700 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-700 text-black font-bold py-3 rounded-lg transition-colors hover:bg-yellow-600 disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
