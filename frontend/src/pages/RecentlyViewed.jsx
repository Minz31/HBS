import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrashIcon, MapPinIcon, StarIcon, EyeIcon } from "@heroicons/react/24/outline";
import { FaHistory } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AccountLayout from "../components/AccountLayout";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const RecentlyViewed = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      setRecentItems(JSON.parse(saved));
    }
  }, []);

  // Remove item
  const removeItem = (hotelId) => {
    const updated = recentItems.filter(item => item.id !== hotelId);
    setRecentItems(updated);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };

  // Clear all
  const clearAll = () => {
    setRecentItems([]);
    localStorage.removeItem("recentlyViewed");
  };

  return (
    <AccountLayout>
      {/* Create Account Banner - Only for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FaHistory className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold dark:text-white">Save your browsing history</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to keep track of hotels you've viewed across devices.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 border-2 border-gray-800 dark:border-white rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
          >
            Create account
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Recently viewed</h1>
        {recentItems.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Recently Viewed List */}
      {recentItems.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <EyeIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">No recently viewed hotels</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Hotels you view will appear here</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition"
          >
            Explore Hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentItems.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden flex"
            >
              {/* Image */}
              <div className="w-40 h-32 flex-shrink-0">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold dark:text-white">{hotel.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    {hotel.city}, {hotel.state}
                  </p>
                  {hotel.ratingScore && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-500" />
                      {hotel.ratingScore} • {hotel.ratingText || "Good"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold dark:text-white">{currency(hotel.price)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">/night</p>
                  </div>
                  <button
                    onClick={() => removeItem(hotel.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    title="Remove"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue Shopping */}
      {recentItems.length > 0 && (
        <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            ← Continue Exploring
          </Link>
        </div>
      )}
    </AccountLayout>
  );
};

export default RecentlyViewed;
