import { useState, useEffect } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import { useHotel } from '../../context/HotelContext';
import { ownerDashboard } from '../../services/completeAPI'; // ownerDashboard has getMyBookings, or define new in completeAPI if needed. 
// completeAPI: ownerRoomManagement, ownerAPI. updateBookingStatus is in ownerAPI.
import { ownerAPI } from '../../services/completeAPI';
import {
    FaSearch,
    FaFilter,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
} from 'react-icons/fa';

const BookingManagement = () => {
    const { selectedHotel } = useHotel();
    const [bookings, setBookings] = useState([]); // All bookings
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchBookings();
    }, [selectedHotel]);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            let data = [];
            if (selectedHotel) {
                // If endpoint available for specific hotel bookings: ownerAPI.getHotelBookings(id)
                // completeAPI.js: getHotelBookings: (hotelId) => api.get(`/owner/hotels/${hotelId}/bookings`)
                // Wait, completeAPI might not have exported 'ownerAPI' directly nicely, let's check imports.
                // It exports 'ownerAPI' as default? No, named exports.
                // Let's assume ownerAPI is available or import specific functions.
                // Looking at HotelOwnerController, there is getHotelBookings.
                // Need to verify completeAPI export. assuming imports work.
                
                // For now, I'll use ownerDashboard.getMyBookings() and filter client side if specific service missing, 
                // but better to use the specific endpoint if defined.
                // Let's use generic ownerAPI wrapper if I can't check file now.
                // I will use 'ownerAPI' imported above.
                if (ownerAPI.getHotelBookings) {
                     const response = await ownerAPI.getHotelBookings(selectedHotel.id);
                     data = response.data || response; // handle axios response
                } else if (ownerDashboard.getMyBookings) {
                    const response = await ownerDashboard.getMyBookings(); // This returns all owner bookings
                    // Filter by selectedHotel
                     const all = response.data || response;
                     data = all.filter(b => b.hotelId === selectedHotel.id); // Assuming booking has hotelId
                }
            } else {
                 if (ownerDashboard.getMyBookings) {
                    const response = await ownerDashboard.getMyBookings();
                    data = response.data || response;
                 }
            }
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let result = bookings;
        if (selectedHotel) { // Already filtered by fetch if selectedHotel, but ensure logic consistency
             // If we used getMyBookings, we might need to filter. 
             // If we used getHotelBookings, it's already filtered.
        }
        
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(b => 
                (b.guestFirstName && b.guestFirstName.toLowerCase().includes(lower)) ||
                (b.bookingReference && b.bookingReference.toLowerCase().includes(lower))
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(b => b.status === statusFilter);
        }

        setFilteredBookings(result);
    }, [bookings, searchTerm, statusFilter, selectedHotel]);

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await ownerAPI.updateBookingStatus(bookingId, newStatus);
            // Update local state
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <OwnerLayout>
           <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold dark:text-white">Booking Management</h1>
                            <p className="text-gray-600 dark:text-gray-400">{filteredBookings.length} bookings found</p>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search bookings..." 
                                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select 
                                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PENDING">Pending</option>
                                <option value="CANCELLED">Cancelled</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Guest</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Room & Dates</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold dark:text-white">{booking.guestFirstName} {booking.guestLastName}</div>
                                                <div className="text-sm text-gray-500">{booking.bookingReference}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="dark:text-white">{booking.roomTypeName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium dark:text-white">
                                                ₹{booking.totalPrice?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={booking.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {booking.status === 'PENDING' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                            title="Confirm"
                                                        >
                                                            <FaCheckCircle />
                                                        </button>
                                                    )}
                                                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                                         <button 
                                                            onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Cancel"
                                                        >
                                                            <FaTimesCircle />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBookings.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
           </div>
        </OwnerLayout>
    );
};

export default BookingManagement;
