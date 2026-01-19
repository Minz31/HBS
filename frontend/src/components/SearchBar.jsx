import { MagnifyingGlassIcon, CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

const SearchBar = () => {
  return (
    <div className="mt-10 bg-white shadow-xl rounded-2xl border overflow-hidden">

      {/* Container */}
      <div className="flex flex-col md:flex-row items-stretch">

        {/* Destination */}
        <div className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
          <div className="w-full">
            <p className="text-xs text-gray-500">Landmark</p>
            <input
              type="text"
              placeholder="Where to?"
              className="outline-none font-semibold text-lg w-full"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r">
          <CalendarIcon className="h-6 w-6 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Check-in/out</p>
            <p className="font-semibold text-lg">Select dates</p>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-4 px-6 py-4 flex-1 border-b md:border-b-0 md:border-r">
          <UserIcon className="h-6 w-6 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Guests and rooms</p>
            <p className="font-semibold text-lg">2 Guests, 1 Room</p>
          </div>
        </div>

        {/* Search Button */}
        <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold text-lg px-10 py-3 rounded-xl mx-4 my-3 shadow-md">
        Search
        </button>


      </div>
    </div>
  );
};

export default SearchBar;
