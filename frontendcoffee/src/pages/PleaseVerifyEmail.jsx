import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

const PleaseVerifyPage = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-center p-4">
    <div>
      <MailCheck size={64} className="mx-auto text-green-400 mb-4" />
      <h1 className="text-3xl font-bold">Check Your Email</h1>
      <p className="text-slate-300 mt-2 max-w-md">
        We've sent a verification link to your email address. Please click the
        link to activate your account.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 text-yellow-400 hover:underline"
      >
        Go to Homepage
      </Link>
    </div>
  </div>
);
export default PleaseVerifyPage;
