import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OwnerLayout from '../../layouts/OwnerLayout';
import {
    FaChartBar,
    FaDollarSign,
    FaCalendarAlt,
    FaArrowUp,
    FaArrowDown,
    FaHotel,
    FaStar,
    FaClock,
} from 'react-icons/fa';
import { useHotel } from '../../context/HotelContext';
import { ownerDashboard } from '../../services/completeAPI';

const HotelierDashboard = () => {
    const [timeRange, setTimeRange] = useState('week');
    const { selectedHotel } = useHotel();

    const [statsData, setStatsData] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [stats, bookings] = await Promise.all([
                    ownerDashboard.getStats(),
                    ownerDashboard.getMyBookings()
                ]);
                setStatsData(stats);
                setRecentBookings(bookings.slice(0, 5)); // Top 5 recent
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Derived stats for display
    const stats = [
        {
            label: 'Total Bookings',
            value: statsData?.totalBookings || 0,
            icon: FaCalendarAlt,
            gradient: 'from-blue-500 to-indigo-600',
        },
        {
            label: 'Total Revenue',
            value: statsData?.totalRevenue ? `₹${statsData.totalRevenue.toLocaleString()}` : '₹0',
            icon: FaDollarSign,
            gradient: 'from-green-500 to-emerald-600',
        },
        {
            label: 'Active Bookings',
            value: statsData?.activeBookings || 0,
            icon: FaHotel,
            gradient: 'from-purple-500 to-pink-600',
        },
         {
            label: 'Total Hotels',
            value: statsData?.totalHotels || 0,
            icon: FaHotel,
            gradient: 'from-orange-500 to-red-600',
        },
    ];

    if (isLoading) {
        return <OwnerLayout><div className="flex justify-center items-center h-screen">Loading...</div></OwnerLayout>;
    }

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            {selectedHotel?.image && (
                                <img
                                    src={selectedHotel.image}
                                    alt={selectedHotel.name}
                                    className="h-12 w-12 rounded-xl object-cover shadow-lg"
                                />
                            )}
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {selectedHotel ? `${selectedHotel.name} Dashboard` : 'Owner Dashboard'} 👋
                                </h1>
                                {selectedHotel && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {selectedHotel.location} • {selectedHotel.totalRooms} Rooms
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Here's what's happening with your properties today
                        </p>
                    </div>

                    {/* Time Range Selector */}
                    <div className="mb-6 flex gap-2">
                        {['Today', 'Week', 'Month', 'Year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range.toLowerCase())}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all ${timeRange === range.toLowerCase()
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            const TrendIcon = stat.trend === 'up' ? FaArrowUp : FaArrowDown;
                            return (
                                <div
                                    key={index}
                                    className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                    {/* Gradient Background */}
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}></div>

                                    <div className="relative z-10 text-center">
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg inline-block mb-4`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{stat.label}</p>
                                        <p className="text-4xl font-black text-gray-900 dark:text-whiteTracking-tight">{stat.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts and Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                                <FaChartBar className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link 
                                    to="/owner/rooms"
                                    className="px-4 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex flex-col items-center gap-3"
                                >
                                    <FaHotel className="h-8 w-8" />
                                    <span>Manage Rooms</span>
                                </Link>
                                <Link 
                                    to="/owner/bookings"
                                    className="px-4 py-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all flex flex-col items-center gap-3"
                                >
                                    <FaCalendarAlt className="h-8 w-8" />
                                    <span>Manage Bookings</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Bookings and Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Bookings */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bookings</h2>
                                <FaCalendarAlt className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="space-y-3">
                                {recentBookings.length === 0 ? <p className="text-gray-500 p-4">No recent bookings</p> : 
                                recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-md transition-all"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{booking.guestFirstName} {booking.guestLastName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{booking.roomTypeName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">{booking.checkInDate}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">{booking.paymentStatus}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'CONFIRMED'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Tasks - Placeholder */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tasks</h2>
                                <FaClock className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="space-y-3">
                                <p className="text-gray-500">No pending tasks.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default HotelierDashboard;
