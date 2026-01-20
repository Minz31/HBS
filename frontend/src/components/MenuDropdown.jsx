import React from "react";
import MenuItem from "./MenuItem";
import MenuSection from "./MenuSection";

import {
  HeartIcon,
  ClockIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const MenuDropdown = ({ open }) => {
  if (!open) return null;

  return (
    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border z-50 p-4">

      <MenuSection title="Trips">
        <MenuItem icon={HeartIcon} label="Favorites" />
        <MenuItem icon={ClockIcon} label="Recently viewed" />
        <MenuItem icon={BriefcaseIcon} label="Bookings" />
      </MenuSection>

      <MenuSection title="Support">
        <MenuItem icon={QuestionMarkCircleIcon} label="Help and support" />
        <MenuItem icon={BuildingOfficeIcon} label="For hoteliers" />
      </MenuSection>

    </div>
  );
};

export default MenuDropdown;
