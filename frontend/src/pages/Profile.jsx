import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [savedMessage, setSavedMessage] = useState("");

  // Load user data on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Load profile from localStorage or use default user data
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // UPDATE - Save profile changes
  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(formData));
    // Update the user in localStorage as well
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...storedUser, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setIsEditing(false);
    setSavedMessage("Profile updated successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  // Cancel editing
  const handleCancel = () => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditing(false);
  };

  // DELETE - Delete account
  const handleDeleteAccount = () => {
    // Clear all user data
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("hotelCart");
    localStorage.removeItem("favorites");
    localStorage.removeItem("recentlyViewed");
    
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
            {formData.name ? formData.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white transition-colors">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information
            </p>
          </div>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 rounded-xl text-green-700 dark:text-green-400 flex items-center gap-2">
            <CheckIcon className="h-5 w-5" />
            {savedMessage}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden transition-colors">
          {/* Card Header */}
          <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750">
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <UserCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Personal Information
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-xl font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <CheckIcon className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white">
                  {formData.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white">
                  {formData.email || "Not provided"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white">
                  {formData.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                  placeholder="Enter your address"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl dark:text-white">
                  {formData.address || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Role */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 p-6 transition-colors">
          <h3 className="text-lg font-bold dark:text-white mb-4">Account Details</h3>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">Role:</span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold capitalize">
              {user?.role || "Customer"}
            </span>
          </div>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-900/50 p-6 transition-colors">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            Danger Zone
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
          >
            <TrashIcon className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Delete Account</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
