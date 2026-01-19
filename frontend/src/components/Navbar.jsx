import logo from "../assets/stays_img.png";
import { GlobeAltIcon, UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b-4 shadow-sm ">
      <div className="w-full flex items-center justify-between h-20 px-12">

        {/* Logo */}
        <div className="flex items-center h-full">
          <img
            src={logo}
            alt="stays.in"
            className="h-12 object-contain"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">

          <button className="flex items-center gap-2 border border-yellow-400 rounded-xl px-4 py-2 hover:bg-yellow-50">
            <GlobeAltIcon className="h-5 w-5" />
            EN · ₹
          </button>

          <button className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 font-semibold hover:bg-yellow-50">
            <UserCircleIcon className="h-5 w-5" />
            Sign in
          </button>

          <button className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 hover:bg-yellow-50">
            <Bars3Icon className="h-5 w-5" />
            Menu
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
