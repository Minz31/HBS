import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    FaUsers,
    FaSearch,
    FaEye,
    FaBan,
    FaCheck,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaShoppingCart,
    FaStar,
    FaHistory,
} from 'react-icons/fa';

const CustomerManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filter, setFilter] = useState('all');

    // Mock customer data
    const [customers, setCustomers] = useState([
        {
            id: 1,
            name: 'Aadesh Kumar',
            email: 'aadesh@email.com',
            phone: '+91 98765 43210',
            joinDate: '2025-08-15',
            status: 'active',
            totalBookings: 12,
            totalSpent: '₹85,400',
            lastActive: '2026-01-24',
            avatar: 'A',
            recentBookings: [
                { hotel: 'Taj Lands End', date: '2026-01-20', amount: '₹18,500' },
                { hotel: 'The Oberoi', date: '2026-01-05', amount: '₹22,000' },
            ],
        },
        {
            id: 2,
            name: 'Priya Sharma',
            email: 'priya.s@email.com',
            phone: '+91 87654 32109',
            joinDate: '2025-10-22',
            status: 'active',
            totalBookings: 8,
            totalSpent: '₹52,300',
            lastActive: '2026-01-23',
            avatar: 'P',
            recentBookings: [
                { hotel: 'JW Marriott', date: '2026-01-18', amount: '₹15,000' },
            ],
        },
        {
            id: 3,
            name: 'Rahul Verma',
            email: 'rahul.v@email.com',
            phone: '+91 76543 21098',
            joinDate: '2025-06-10',
            status: 'inactive',
            totalBookings: 3,
            totalSpent: '₹24,500',
            lastActive: '2025-12-15',
            avatar: 'R',
            recentBookings: [],
        },
        {
            id: 4,
            name: 'Sneha Patel',
            email: 'sneha.p@email.com',
            phone: '+91 65432 10987',
            joinDate: '2025-11-05',
            status: 'suspended',
            totalBookings: 5,
            totalSpent: '₹38,200',
            lastActive: '2026-01-10',
            avatar: 'S',
            suspensionReason: 'Multiple payment chargebacks',
            recentBookings: [],
        },
        {
            id: 5,
            name: 'Amit Singh',
            email: 'amit.s@email.com',
            phone: '+91 54321 09876',
            joinDate: '2025-09-18',
            status: 'active',
            totalBookings: 15,
            totalSpent: '₹1,20,800',
            lastActive: '2026-01-24',
            avatar: 'A',
            recentBookings: [
                { hotel: 'Rambagh Palace', date: '2026-01-22', amount: '₹45,000' },
                { hotel: 'ITC Grand Chola', date: '2026-01-15', amount: '₹19,000' },
            ],
        },
    ]);

    // Filter and search customers
    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || customer.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Toggle customer status
    const toggleStatus = (customerId, newStatus) => {
        setCustomers(prev => prev.map(customer =>
            customer.id === customerId ? { ...customer, status: newStatus } : customer
        ));
    };

    // Delete customer
    const handleDelete = (customerId) => {
        if (confirm('Are you sure you want to delete this customer account?')) {
            setCustomers(prev => prev.filter(customer => customer.id !== customerId));
            setSelectedCustomer(null);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                            <FaUsers className="text-blue-600" /> Customer Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            View and manage customer accounts
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customers by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            {[
                                { key: 'all', label: 'All' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === tab.key
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{customers.length}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Customer</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Contact</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Bookings</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-700">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                        {customer.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{customer.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined {customer.joinDate}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{customer.email}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900 dark:text-white">{customer.totalBookings} bookings</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{customer.totalSpent} spent</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedCustomer(customer)}
                                                        className="p-2 border border-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {filteredCustomers.length === 0 && (
                            <div className="text-center py-12">
                                <FaUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">No customers found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                                    {selectedCustomer.avatar}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{selectedCustomer.name}</h2>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <FaEnvelope className="text-blue-500" />
                                {selectedCustomer.email}
                            </p>
                            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <FaPhone className="text-blue-500" />
                                {selectedCustomer.phone}
                            </p>
                            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <FaCalendarAlt className="text-blue-500" />
                                Joined: {selectedCustomer.joinDate}
                            </p>
                            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <FaHistory className="text-blue-500" />
                                Last Active: {selectedCustomer.lastActive}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                <FaShoppingCart className="text-blue-600 dark:text-blue-400 mb-2" />
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedCustomer.totalBookings}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                                <FaStar className="text-green-600 dark:text-green-400 mb-2" />
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedCustomer.totalSpent}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        {selectedCustomer.recentBookings.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-bold dark:text-white mb-3">Recent Bookings</h3>
                                <div className="space-y-2">
                                    {selectedCustomer.recentBookings.map((booking, idx) => (
                                        <div key={idx} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-700 dark:text-gray-300">{booking.hotel}</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{booking.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">

                            <button
                                onClick={() => handleDelete(selectedCustomer.id)}
                                className="px-4 py-3 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CustomerManagement;
