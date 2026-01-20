import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

const Hoteliers = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <BuildingOfficeIcon className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">List your property with us</h1>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of hoteliers who trust us to grow their business. 
          Get access to millions of travelers and powerful tools to manage your property.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                Get started
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition">
                Learn more
            </button>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-3">Global Reach</h3>
            <p className="text-gray-600">Connect with travelers from all over the world and increase your bookings.</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-3">Easy Management</h3>
            <p className="text-gray-600">Use our intuitive dashboard to manage availability, rates, and reservations.</p>
        </div>
        <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
            <p className="text-gray-600">Our dedicated support team is always here to help you succeed.</p>
        </div>
      </div>
    </div>
  );
};

export default Hoteliers;
