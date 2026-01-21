import logo from "../assets/stays_img.png";
import {
  GlobeAltIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MenuDropdown from "./MenuDropdown";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, getUserInitials } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="w-full flex items-center justify-between h-20 px-4 md:px-12">

        {/* Logo */}
        <Link to="/" className="flex items-center h-full">
          <img
            src={logo}
            alt="stays.in"
            className="h-12 object-contain cursor-pointer"
          />
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-4">

          {/* Language/Currency Button */}
          <button className="flex items-center gap-2 border border-yellow-400 rounded-xl px-4 py-2 hover:bg-yellow-50 transition-colors">
            <GlobeAltIcon className="h-5 w-5" />
            EN · ₹
          </button>

          {/* User Avatar / Sign In Button */}
          <div ref={menuRef} className="relative">
            {isAuthenticated ? (
              /* Logged In - Show User Avatar with Initial */
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 group"
              >
                {/* User Avatar Circle - Similar to Trivago's blue circle "A" */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  {getUserInitials()}
                </div>
              </button>
            ) : (
              /* Not Logged In - Show Sign In Button */
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 font-semibold hover:bg-yellow-50 transition-colors"
              >
                <UserCircleIcon className="h-5 w-5" />
                Sign in
              </button>
            )}

            {/* Dropdown Menu - Only shows when authenticated and clicked on avatar */}
            {isAuthenticated && (
              <MenuDropdown open={openMenu} onClose={() => setOpenMenu(false)} />
            )}
          </div>

          {/* Menu Button - Only show if NOT authenticated */}
          {!isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 hover:bg-yellow-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                Menu
              </button>
              <MenuDropdown open={openMenu} onClose={() => setOpenMenu(false)} />
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
