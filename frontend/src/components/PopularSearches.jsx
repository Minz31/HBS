import { useState, useRef, useEffect } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { publicAPI } from '../services/completeAPI';

const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v);

const CityCard = ({ item, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden min-w-[260px] hover:shadow-md transition group"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-40 w-full object-cover"
      />
      <div className="p-4">
        <p className="text-lg font-bold dark:text-white">{item.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{item.hotels.toLocaleString()} Hotels</p>
        <p className="text-sm font-semibold dark:text-gray-300">{currency(item.avg)} Avg.</p>
      </div>
    </button>
  );
};

const DestinationCard = ({ item, navigate }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden min-w-[300px] h-fit transition-colors">
      <img
        src={item.image}
        alt={item.state}
        className="h-36 w-full object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold dark:text-white">{item.state}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.totalHotels.toLocaleString()} Hotels</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <ChevronDownIcon
              className={`h-5 w-5 dark:text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {expanded && (
          <div className="mt-3 pt-3 border-t dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 font-semibold">Popular cities:</p>
            <div className="flex flex-wrap gap-2">
              {item.cities.map((city) => (
                <button
                  key={city}
                  onClick={() =>
                    navigate(`/search?destination=${encodeURIComponent(city)}&adults=2&rooms=1`)
                  }
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-800/40 transition"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PopularSearches = () => {
  const [tab, setTab] = useState("Cities");
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [citiesData, statesData] = await Promise.all([
            publicAPI.getDestinations('city'),
            publicAPI.getDestinations('state')
        ]);
        setCities(citiesData || []);
        setDestinations(statesData || []);
    } catch (error) {
        console.error("Failed to fetch destinations", error);
    } finally {
        setLoading(false);
    }
  };

  const scrollRight = () => {
    if (scrollerRef.current) scrollerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mt-10 mb-20">
      <h2 className="text-2xl font-bold mb-4 dark:text-white transition-colors">Popular searches</h2>
      <div className="flex gap-6 mb-4 border-b dark:border-gray-700">
        <button
          onClick={() => setTab("Cities")}
          className={`font-semibold pb-2 border-b-2 transition ${
            tab === "Cities" 
              ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
              : "text-gray-500 border-transparent dark:text-gray-400"
          }`}
        >
          Cities
        </button>
        <button
          onClick={() => setTab("Destinations")}
          className={`font-semibold pb-2 border-b-2 transition ${
            tab === "Destinations" 
              ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
              : "text-gray-500 border-transparent dark:text-gray-400"
          }`}
        >
          Destinations
        </button>
      </div>
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 pr-10"
          style={{ scrollbarWidth: "none" }}
        >
          {loading ? (
             <div className="flex gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="min-w-[260px] h-60 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
               ))}
             </div>
          ) : (
            <>
              {tab === "Cities" &&
                cities.map((c) => (
                  <CityCard
                    key={c.name}
                    item={c}
                    onClick={() =>
                      navigate(
                        `/search?destination=${encodeURIComponent(c.name)}&adults=2&rooms=1`
                      )
                    }
                  />
                ))}
              {tab === "Destinations" &&
                destinations.map((d) => (
                  <DestinationCard key={d.name} item={{
                      state: d.name,
                      image: d.image,
                      totalHotels: d.hotels,
                      cities: d.cities || []
                  }} navigate={navigate} />
                ))}
            </>
          )}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-full p-2 shadow z-10"
        >
          <ChevronRightIcon className="h-5 w-5 dark:text-white" />
        </button>
      </div>
    </div>
  );
};

export default PopularSearches;
