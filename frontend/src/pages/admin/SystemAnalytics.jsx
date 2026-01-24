import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { FaHotel, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalHotels: 248,
    totalCustomers: 15420,
    totalBookings: 8956,
    totalRevenue: 45678000,
    pendingApprovals: 12,
    activeListings: 235,
    monthlyGrowth: 12.5,
    customerGrowth: 8.3
  });

  const [recentBookings] = useState([
    { id: 1, hotel: 'Taj Lands End', customer: 'John Doe', amount: 45500, date: '2026-01-24', status: 'confirmed' },
    { id: 2, hotel: 'The Oberoi', customer: 'Jane Smith', amount: 78000, date: '2026-01-23', status: 'confirmed' },
    { id: 3, hotel: 'ITC Maratha', customer: 'Mike Johnson', amount: 32000, date: '2026-01-23', status: 'pending' },
    { id: 4, hotel: 'Leela Palace', customer: 'Sarah Williams', amount: 125000, date: '2026-01-22', status: 'confirmed' },
    { id: 5, hotel: 'Trident', customer: 'David Brown', amount: 28500, date: '2026-01-22', status: 'cancelled' },
  ]);

  const [topLocations] = useState([
    { city: 'Goa', hotels: 62, bookings: 1250, revenue: 8500000 },
    { city: 'Mumbai', hotels: 45, bookings: 980, revenue: 7800000 },
    { city: 'Delhi', hotels: 38, bookings: 850, revenue: 6500000 },
    { city: 'Jaipur', hotels: 28, bookings: 620, revenue: 4200000 },
    { city: 'Udaipur', hotels: 22, bookings: 480, revenue: 5100000 },
  ]);

  const [monthlyData] = useState([
    { month: 'Jan', bookings: 720, revenue: 3200000 },
    { month: 'Feb', bookings: 680, revenue: 2900000 },
    { month: 'Mar', bookings: 890, revenue: 4100000 },
    { month: 'Apr', bookings: 950, revenue: 4500000 },
    { month: 'May', bookings: 1100, revenue: 5200000 },
    { month: 'Jun', bookings: 1250, revenue: 5800000 },
  ]);

  const currency = (v) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', currency: 'INR', maximumFractionDigits: 0 
  }).format(v);

  const formatNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <AdminLayout>
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <ChartBarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold dark:text-white">System Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400">Overview of platform performance</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl font-semibold transition ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FaHotel className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  +{stats.monthlyGrowth}%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Hotels</p>
              <p className="text-3xl font-bold dark:text-white">{stats.totalHotels}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <FaUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                  +{stats.customerGrowth}%
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
              <p className="text-3xl font-bold dark:text-white">{formatNumber(stats.totalCustomers)}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
              <p className="text-3xl font-bold dark:text-white">{formatNumber(stats.totalBookings)}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <FaMoneyBillWave className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              <p className="text-sm text-gray-800">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalRevenue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <h3 className="text-lg font-bold dark:text-white mb-6">Revenue Trend</h3>
              <div className="h-64 flex items-end justify-between gap-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {formatNumber(data.revenue)}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                        style={{ height: `${(data.revenue / maxRevenue) * 180}px` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6">
              <h3 className="text-lg font-bold dark:text-white mb-6">Top Locations</h3>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold dark:text-white">{location.city}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{location.hotels} hotels</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 dark:text-green-400">{formatNumber(location.revenue)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{location.bookings} bookings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-bold dark:text-white">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Hotel</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Customer</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="py-4 px-6 font-semibold dark:text-white">{booking.hotel}</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{booking.customer}</td>
                      <td className="py-4 px-6 font-bold text-green-600 dark:text-green-400">{currency(booking.amount)}</td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{booking.date}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemAnalytics;
