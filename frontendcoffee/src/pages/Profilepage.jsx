import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authApi } from "../utils/api";
import { loginSuccess } from "../redux/slices/userSlice";
import { User, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/userSlice";
const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
  });
  useEffect(() => {
    if (currentUser) {
      setProfileData({ name: currentUser.name, email: currentUser.email });
    }
  }, [currentUser]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await authApi.updateProfile(profileData);
      dispatch(loginSuccess(updatedUser));
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const c = await authApi.changePassword(passwordData);
      setMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      const l = await authApi.logout();
      if (c && l) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password.");
    }
  };
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  if (!isAuthenticated) {
    return (
      <div className="text-center p-8 text-white">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16 bg-gradient-to-br  from-black via-violet-900 to-indigo-900">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-center">My Profile</h1>

        {message && (
          <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center mb-6 flex items-center justify-center gap-2">
            <CheckCircle size={18} /> {message}
          </div>
        )}

        {/* Update Profile Details Form */}
        <div className="bg-gray-800 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <User /> Profile Details
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="bg-gray-700 border border-gray-600 rounded-md p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                className="bg-gray-700 border border-gray-600 rounded-md p-2"
                readOnly
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Lock /> Change Password
          </h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisibility.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {passwordVisibility.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisibility.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {passwordVisibility.new ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
