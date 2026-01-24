import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/AccountLayout";
import { FaBell } from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  return (
    <AccountLayout>
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Help and support</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">How can we help you?</p>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 max-w-xl border dark:border-gray-700 transition-colors">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-yellow-400 text-black p-3 rounded-full">
            <FaBell/>
          </div>
          <p className="font-medium dark:text-white">
            Need priority support? Sign in or create an account to get help faster.
          </p>
        </div>

        <div className="flex gap-4">
          <button 
          onClick={() => navigate("/login")}
          className="border border-yellow-400 px-6 py-2 rounded-xl font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white transition-colors">
            Sign in or create account
          </button>
          <button className="border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white transition-colors">
            Visit help center
          </button>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Help;
