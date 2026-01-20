import logo from "../assets/stays_img.png";
import {
  GlobeAltIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import MenuDropdown from "./MenuDropdown";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
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

          {/* Menu Button + Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 border border-yellow-400 rounded-xl px-5 py-2 hover:bg-yellow-50"
            >
              <Bars3Icon className="h-5 w-5" />
              Menu
            </button>

            {/* Dropdown */}
            <MenuDropdown open={openMenu} />
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
