import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  HeartIcon,
  ClockIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const menu = [
  { name: "Favorites", path: "/favorites", icon: HeartIcon },
  { name: "Recently viewed", path: "/recent", icon: ClockIcon },
  { name: "Bookings", path: "/bookings", icon: BriefcaseIcon },
  { name: "Help and support", path: "/help", icon: QuestionMarkCircleIcon },
];

const AccountSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 border-r bg-white p-4 space-y-2">
      <Link to="/" className="flex items-center gap-2 mb-6 text-sm font-semibold">
        <FaArrowLeft/> Back
      </Link>

      {menu.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
              active
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
};

export default AccountSidebar;
