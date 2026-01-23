const MenuSection = ({ title, children }) => {
  return (
<<<<<<< Updated upstream
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
=======
    <div className="mb-4 last:mb-0">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3">
>>>>>>> Stashed changes
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default MenuSection;
