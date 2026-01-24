import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  TicketIcon, 
  CalendarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { FaTicketAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AccountLayout from "../components/AccountLayout";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

const Bookings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    rooms: 1
  });

  // Load bookings from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem("bookings");
      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        // Mock bookings for demo
        const mockBookings = [
          {
            id: 1,
            hotel: "Taj Lands End",
            city: "Mumbai",
            roomType: "Ocean View Room",
            checkIn: "2026-02-15",
            checkOut: "2026-02-18",
            guests: 2,
            rooms: 1,
            price: 55500,
            status: "confirmed",
            bookingDate: "2026-01-20",
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60",
          },
          {
            id: 2,
            hotel: "The Oberoi Udaivilas",
            city: "Udaipur",
            roomType: "Premier Lake View Room",
            checkIn: "2026-03-10",
            checkOut: "2026-03-14",
            guests: 2,
            rooms: 1,
            price: 180000,
            status: "pending",
            bookingDate: "2026-01-22",
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=60",
          },
        ];
        setBookings(mockBookings);
        localStorage.setItem("bookings", JSON.stringify(mockBookings));
      }
    }
  }, [isAuthenticated]);

  // Cancel booking
  const handleCancelBooking = () => {
    const updated = bookings.map(b => 
      b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  // Open edit modal
  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      rooms: booking.rooms
    });
    setShowEditModal(true);
  };

  // Update booking
  const handleUpdateBooking = () => {
    const updated = bookings.map(b => 
      b.id === selectedBooking.id 
        ? { ...b, checkIn: editForm.checkIn, checkOut: editForm.checkOut, rooms: editForm.rooms } 
        : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setShowEditModal(false);
    setSelectedBooking(null);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <AccountLayout>
      {/* Create Account Banner - Only for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FaTicketAlt className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold dark:text-white">Manage your bookings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to view, update, or cancel your hotel bookings.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 border-2 border-gray-800 dark:border-white rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
          >
            Create account
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold dark:text-white mb-6">Bookings</h1>

      {/* Not Logged In State */}
      {!isAuthenticated ? (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <TicketIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold dark:text-white mb-2">Your bookings</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Sign in to view and manage your bookings</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-600 transition shadow-lg"
          >
            Sign in
          </button>
        </div>
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'pending', label: 'Pending' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === tab.key
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12 text-center">
              <TicketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold dark:text-white mb-2">No bookings found</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings.`}
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-semibold"
              >
                Explore Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                      <img
                        src={booking.image}
                        alt={booking.hotel}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold dark:text-white">{booking.hotel}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {booking.city} • {booking.roomType}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Check-in</p>
                          <p className="font-semibold dark:text-white flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                            {booking.checkIn}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Check-out</p>
                          <p className="font-semibold dark:text-white flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-blue-500" />
                            {booking.checkOut}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Guests & Rooms</p>
                          <p className="font-semibold dark:text-white flex items-center gap-1">
                            <UserGroupIcon className="h-4 w-4 text-blue-500" />
                            {booking.guests} Guests, {booking.rooms} Room
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {currency(booking.price)}
                          </p>
                        </div>
                      </div>

                      {/* Actions - Only for confirmed/pending bookings */}
                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Update Booking
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowCancelModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold dark:text-white mb-4">Update Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedBooking.hotel}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={editForm.checkIn}
                  onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out Date</label>
                <input
                  type="date"
                  value={editForm.checkOut}
                  onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editForm.rooms}
                  onChange={(e) => setEditForm({...editForm, rooms: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl font-bold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XMarkIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">Cancel Booking</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to cancel your booking at <strong>{selectedBooking.hotel}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default Bookings;
