import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../utils/api.js";
import { KeyRound, CheckCircle, AlertTriangle } from "lucide-react";

const VerifyCodePage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.verifyEmailCode(email, code);

      setIsVerified(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-center p-4">
        <div>
          <AlertTriangle size={64} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-3xl font-bold">Something Went Wrong</h1>
          <p className="text-slate-300 mt-2">
            We don't know which email to verify. Please try signing up again.
          </p>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-center p-4">
        <div>
          <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
          <h1 className="text-3xl font-bold">Verification Successful!</h1>
          <p className="text-slate-300 mt-2">
            Redirecting you to the login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center text-white text-center p-4">
      <div>
        <KeyRound size={64} className="mx-auto text-orange-700 mb-4" />
        <h1 className="text-3xl font-bold">Enter Verification Code</h1>
        <p className="text-slate-300 mt-2">
          A 6-digit code has been sent to{" "}
          <span className="font-bold text-white">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-sm mx-auto">
          <input
            type="tel"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength="6"
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-lg text-center text-white text-3xl tracking-[1rem] focus:ring-2 focus:ring-orange-700 focus:outline-none"
            placeholder="______"
          />
          {error && <p className="text-red-400 mt-4">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-orange-700 text-black font-bold py-3 rounded-lg transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCodePage;
