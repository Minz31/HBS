import SearchBar from "../components/SearchBar";
import { useAuth } from '../context/AuthContext';
import PopularSearches from "../components/PopularSearches";
import RecentlyViewedHotels from "../components/RecentlyViewedHotels";
import { useState, useEffect } from 'react';
import customerAPI from '../services/customerAPI';

function Home() {
  const { isAuthenticated, user } = useAuth();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await customerAPI.homePage.loadHotels();
      setHotels(response);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Personalized Greeting */}
        <h1 className="text-3xl font-bold text-center md:text-left dark:text-white transition-colors">
          {isAuthenticated
            ? `Ready to find a great hotel deal, ${user?.name}?`
            : "Save up to 55% on your next hotel stay"}
        </h1>

        {isAuthenticated && (
          <p className="text-gray-600 mt-2 text-lg text-center md:text-left dark:text-gray-300">
            Save up to 55% on your next hotel stay
          </p>
        )}

        <SearchBar hotels={hotels} />

        {/* Recently Viewed Hotels - Only shows if user has viewed hotels */}
        <RecentlyViewedHotels />

        {/* Popular Searches - Cities & Destinations tabs */}
        <PopularSearches />
      </div>
    </div>
  );
};

export default Home;