import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrashIcon, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AccountLayout from "../components/AccountLayout";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Remove from favorites
  const removeFavorite = (hotelId) => {
    const updated = favorites.filter(f => f.id !== hotelId);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  return (
    <AccountLayout>
      {/* Create Account Banner - Only for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <FaHeart className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h3 className="font-bold dark:text-white">Keep track of stays you like</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Save your favorite stays to your account and create your own lists.</p>
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
        <h1 className="text-3xl font-bold dark:text-white">Your favorites</h1>
        {favorites.length > 0 && isAuthenticated && (
          <button
            onClick={clearAllFavorites}
            className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">Your next stay</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-1">({favorites.length} stays)</p>
          <Link
            to="/"
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Start exploring hotels →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border dark:border-gray-700 transition-all hover:shadow-xl group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeFavorite(hotel.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title="Remove from favorites"
                >
                  <FaHeart className="h-5 w-5 text-red-500" />
                </button>
                {hotel.ratingScore && (
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-1">
                    <StarIcon className="h-4 w-4" />
                    {hotel.ratingScore}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold dark:text-white mb-1">{hotel.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1 mb-2">
                  <MapPinIcon className="h-4 w-4" />
                  {hotel.city}, {hotel.state}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold dark:text-white">{currency(hotel.price)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400"> /night</span>
                  </div>
                  <Link
                    to={`/search?destination=${hotel.city}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue Shopping */}
      {favorites.length > 0 && (
        <div className="text-center mt-8">
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            ← Continue Exploring
          </Link>
        </div>
      )}
    </AccountLayout>
  );
};

export default Favorites;
