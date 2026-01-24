const MenuSection = ({ title, children }) => {
  return (
    <div className="mb-4 last:mb-0 px-4">
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default MenuSection;
