import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    FaUsers,
    FaHotel,
    FaChartLine,
    FaClipboardList,
    FaExclamationTriangle,
    FaCheckCircle,
    FaArrowUp,
    FaArrowDown,
    FaCog,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('week');

    // Mock statistics
    const stats = [
        {
            label: 'Total Hotels',
            value: '1,247',
            change: '+23',
            trend: 'up',
            icon: FaHotel,
            gradient: 'from-blue-500 to-indigo-600',
            link: '/superadmin/hotels',
        },
        {
            label: 'Active Users',
            value: '45,892',
            change: '+1,234',
            trend: 'up',
            icon: FaUsers,
            gradient: 'from-emerald-500 to-teal-600',
            link: '/superadmin/customers',
        },
        {
            label: 'Pending Approvals',
            value: '18',
            change: '-5',
            trend: 'down',
            icon: FaClipboardList,
            gradient: 'from-amber-500 to-orange-600',
            link: '/superadmin/approvals',
        },
        {
            label: 'Open Complaints',
            value: '42',
            change: '+8',
            trend: 'up',
            icon: FaExclamationTriangle,
            gradient: 'from-red-500 to-pink-600',
            link: '/superadmin/complaints',
        },
    ];

    // Quick actions
    const quickActions = [
        { label: 'Approve Hotels', icon: FaCheckCircle, link: '/superadmin/approvals', color: 'from-blue-600 to-blue-700' },
        { label: 'View Analytics', icon: FaChartLine, link: '/superadmin/analytics', color: 'from-emerald-600 to-emerald-700' },
        { label: 'Manage Locations', icon: FaMapMarkerAlt, link: '/superadmin/locations', color: 'from-purple-600 to-purple-700' },
        { label: 'System Settings', icon: FaCog, link: '/superadmin/settings', color: 'from-gray-600 to-gray-700' },
    ];

    // Recent activities
    const recentActivities = [
        { id: 1, action: 'New hotel registered', hotel: 'Grand Palace Hotel', time: '5 min ago', type: 'hotel' },
        { id: 2, action: 'Complaint resolved', user: 'John Doe', time: '15 min ago', type: 'complaint' },
        { id: 3, action: 'Hotel approved', hotel: 'Sea View Resort', time: '1 hour ago', type: 'approval' },
        { id: 4, action: 'New user registered', user: 'Sarah Smith', time: '2 hours ago', type: 'user' },
        { id: 5, action: 'Hotel removed', hotel: 'Old Inn', time: '3 hours ago', type: 'removal' },
    ];

    // Pending approvals
    const pendingApprovals = [
        { id: 1, name: 'Sunset Beach Hotel', location: 'Goa', owner: 'Raj Kumar', date: '2026-01-23' },
        { id: 2, name: 'Mountain View Lodge', location: 'Shimla', owner: 'Priya Sharma', date: '2026-01-22' },
        { id: 3, name: 'City Center Inn', location: 'Mumbai', owner: 'Amit Patel', date: '2026-01-21' },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Dashboard 🛡️
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage hotels, users, and system settings
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            const TrendIcon = stat.trend === 'up' ? FaArrowUp : FaArrowDown;
                            return (
                                <Link
                                    to={stat.link}
                                    key={index}
                                    className="relative group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                <TrendIcon className="h-4 w-4" />
                                                <span className="text-sm font-semibold">{stat.change}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        to={action.link}
                                        key={index}
                                        className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-semibold flex items-center gap-3 hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {action.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pending Approvals */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Approvals</h2>
                                <Link to="/superadmin/approvals" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                                    View All →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {pendingApprovals.map((hotel) => (
                                    <div
                                        key={hotel.id}
                                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-700 dark:to-gray-600 rounded-xl"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{hotel.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{hotel.location} • {hotel.owner}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1.5 border border-red-400 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                                <Link to="/superadmin/logs" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">
                                    View Logs →
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            activity.type === 'hotel' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                            activity.type === 'complaint' ? 'bg-red-100 dark:bg-red-900/30' :
                                            activity.type === 'approval' ? 'bg-green-100 dark:bg-green-900/30' :
                                            activity.type === 'removal' ? 'bg-gray-100 dark:bg-gray-700' :
                                            'bg-purple-100 dark:bg-purple-900/30'
                                        }`}>
                                            {activity.type === 'hotel' && <FaHotel className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                                            {activity.type === 'complaint' && <FaExclamationTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />}
                                            {activity.type === 'approval' && <FaCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                                            {activity.type === 'user' && <FaUsers className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                                            {activity.type === 'removal' && <FaHotel className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{activity.action}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {activity.hotel || activity.user} • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SuperAdminDashboard;
