import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import customerAPI from '../services/customerAPI';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  HeartIcon,
  ClockIcon,
  ShoppingBagIcon,
  QuestionMarkCircleIcon,
  HomeModernIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("personal"); // 'personal' or 'security'
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = await customerAPI.auth.getProfile();
      setFormData({
        name: (profileData.firstName + " " + (profileData.lastName || "")).trim(),
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
      // Sync localStorage for other components
      localStorage.setItem("user", JSON.stringify({
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        name: (profileData.firstName + " " + (profileData.lastName || "")).trim(),
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        role: profileData.userRole
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data from server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const nameParts = formData.name.trim().split(' ');
      const userData = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      await customerAPI.auth.updateProfile(userData);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      fetchProfile(); // Refresh to ensure sync
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);
    try {
      await customerAPI.auth.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API
    logout();
    navigate("/");
    toast.success('Account deleted successfully');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-blue-500/30">
            {formData.name ? formData.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">My Profile</h1>
            <p className="text-slate-400 text-lg">Manage your personal information</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Areas */}
          <div className="flex-1 space-y-6">
            {activeTab === 'personal' ? (
              <div className="bg-[#1e293b] rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <UserCircleIcon className="h-7 w-7 text-blue-400" />
                    Personal Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all border border-slate-600"
                    >
                      <PencilIcon className="h-4 w-4 inline mr-2" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg"
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder={user?.name || "Enter your full name"}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled // Email should typically not be editable in this view
                        placeholder={user?.email || "Enter your email address"}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder={user?.phone || "Enter your phone number"}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder={user?.address || "Enter your address"}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1e293b] rounded-3xl shadow-xl border border-slate-700/50 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-700/50 bg-slate-800/50">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <ShieldCheckIcon className="h-7 w-7 text-green-400" />
                    Account Security
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="max-w-md space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200">Change Password</h3>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg mt-2"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Role / Additional Info */}
            <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Account Info</h3>
                <p className="text-slate-400">Your current system permissions</p>
              </div>
              <span className="px-5 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-bold border border-blue-500/20">
                Role: {user?.role?.replace('ROLE_', '') || 'User'}
              </span>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Danger Zone
              </h3>
              <p className="text-slate-400 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72">
            <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 overflow-hidden sticky top-24 shadow-2xl">
              <div className="p-6">
                {/* Account Section */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Account</p>
                  <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveTab('personal')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === 'personal' ? 'bg-blue-600 text-white ring-4 ring-blue-600/10' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span className="font-medium">Personal info</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('security')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white ring-4 ring-blue-600/10' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                      <ShieldCheckIcon className="h-5 w-5" />
                      <span className="font-medium">Account security</span>
                    </button>
                  </nav>
                </div>

                {/* Trips Section */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Trips</p>
                  <nav className="space-y-1">
                    <button onClick={() => navigate('/favorites')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">
                      <HeartIcon className="h-5 w-5" />
                      <span className="font-medium">Favorites</span>
                    </button>
                    <button onClick={() => navigate('/recent')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">
                      <ClockIcon className="h-5 w-5" />
                      <span className="font-medium">Recently viewed</span>
                    </button>
                    <button onClick={() => navigate('/bookings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">
                      <ShoppingBagIcon className="h-5 w-5" />
                      <span className="font-medium">Bookings</span>
                    </button>
                  </nav>
                </div>

                {/* Support Section */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">Support</p>
                  <nav className="space-y-1">
                    <button onClick={() => navigate('/help')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">
                      <QuestionMarkCircleIcon className="h-5 w-5" />
                      <span className="font-medium">Help and support</span>
                    </button>
                    <button onClick={() => navigate('/hoteliers')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">
                      <HomeModernIcon className="h-5 w-5" />
                      <span className="font-medium">Become a Host</span>
                    </button>
                  </nav>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="font-medium">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/5">
            <h3 className="text-2xl font-bold mb-4">Delete Account?</h3>
            <p className="text-slate-400 mb-8">This action is permanent and cannot be undone. All your bookings and data will be erased.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold">Cancel</button>
              <button onClick={handleDeleteAccount} className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
