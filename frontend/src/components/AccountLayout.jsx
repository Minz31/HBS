import AccountSidebar from "./AccountSidebar";

const AccountLayout = ({ children }) => {
  return (
    <div className="max-w-[1300px] mx-auto flex gap-8 px-6 py-10">
      <AccountSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AccountLayout;
