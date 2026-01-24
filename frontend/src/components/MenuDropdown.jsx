import MenuItem from "./MenuItem";
import MenuSection from "./MenuSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  ShieldCheckIcon,
  HeartIcon,
  ClockIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const MenuDropdown = ({ open, onClose }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  // Menu for logged-in users (Trivago style)
  if (isAuthenticated) {
    return (
      <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-600 z-[100] py-4 max-h-[calc(100vh-120px)] overflow-y-auto">

        {/* Account Section */}
        <MenuSection title="Account">
          <MenuItem
            icon={UserIcon}
            label="Personal info"
            to="/profile"
            onClick={onClose}
          />
          <MenuItem
            icon={ShieldCheckIcon}
            label="Account security"
            to="/profile"
            onClick={onClose}
          />
        </MenuSection>

        {/* Trips Section */}
        <MenuSection title="Trips">
          <MenuItem
            icon={HeartIcon}
            label="Favorites"
            to="/favorites"
            onClick={onClose}
          />
          <MenuItem
            icon={ClockIcon}
            label="Recently viewed"
            to="/recent"
            onClick={onClose}
          />
          <MenuItem
            icon={BriefcaseIcon}
            label="Bookings"
            to="/bookings"
            onClick={onClose}
          />
        </MenuSection>


        <MenuSection title="Support">
          <MenuItem
            icon={QuestionMarkCircleIcon}
            label="Help and support"
            to="/help"
            onClick={onClose}
          />
        {/* Role-based dashboard links */}
          {user?.role === 'admin' && (
            <MenuItem
              icon={BuildingOfficeIcon}
              label="Admin Panel"
              to="/admin/dashboard"
              onClick={onClose}
            />
          )}
          {user?.role === 'owner' && (
            <MenuItem
              icon={BuildingOfficeIcon}
              label="Owner Dashboard"
              to="/owner/dashboard"
              onClick={onClose}
            />
          )}
          {user?.role === 'user' && (
            <MenuItem
              icon={BuildingOfficeIcon}
              label="Become a Host"
              to="/hoteliers"
              onClick={onClose}
            />
          )}
        </MenuSection>

        {/* Logout - Separate with border */}
        <div className="border-t border-gray-100 mt-2 pt-2 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    );
  }

  // Menu for non-logged-in users (original)
  return (
    <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-600 z-[100] py-4 max-h-[calc(100vh-120px)] overflow-y-auto">

      <MenuSection title="Trips">
        <MenuItem icon={HeartIcon} label="Favorites" to="/favorites" onClick={onClose} />
        <MenuItem icon={ClockIcon} label="Recently viewed" to="/recent" onClick={onClose} />
        <MenuItem icon={BriefcaseIcon} label="Bookings" to="/bookings" onClick={onClose} />
      </MenuSection>

      <MenuSection title="Support">
        <MenuItem icon={QuestionMarkCircleIcon} label="Help and support" to="/help" onClick={onClose} />
        <MenuItem
          icon={BuildingOfficeIcon}
          label="For hoteliers"
          to="/hoteliers"
          onClick={onClose}
        />
      </MenuSection>

    </div>
  );
};

export default MenuDropdown;
