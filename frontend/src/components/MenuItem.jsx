import React from "react";

const MenuItem = ({ icon: Icon, label }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
      <Icon className="h-5 w-5 text-gray-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export default MenuItem;
