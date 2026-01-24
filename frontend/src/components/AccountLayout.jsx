import AccountSidebar from "./AccountSidebar";

const AccountLayout = ({ children }) => {
  return (
    <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto flex gap-8 px-6 py-6">
        <AccountSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AccountLayout;
