import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
    FaHotel,
    FaCheck,
    FaTimes,
    FaEye,
    FaMapMarkerAlt,
    FaUser,
    FaCalendarAlt,
    FaStar,
    FaBed,
} from 'react-icons/fa';

const HotelApprovals = () => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [filter, setFilter] = useState('pending');

    // Mock data for pending hotels
    const [hotels, setHotels] = useState([
        {
            id: 1,
            name: 'Sunset Beach Resort',
            location: 'Calangute, Goa',
            owner: 'Raj Kumar',
            email: 'raj@sunset.com',
            phone: '+91 98765 43210',
            rooms: 45,
            submittedDate: '2026-01-23',
            status: 'pending',
            description: 'A beautiful beachfront resort with stunning sunset views. Features include pool, spa, restaurant, and direct beach access.',
            amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access', 'WiFi', 'Parking'],
            images: [
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=60',
            ],
            priceRange: '₹5,000 - ₹15,000',
        },
        {
            id: 2,
            name: 'Mountain View Lodge',
            location: 'Mall Road, Shimla',
            owner: 'Priya Sharma',
            email: 'priya@mvl.com',
            phone: '+91 87654 32109',
            rooms: 28,
            submittedDate: '2026-01-22',
            status: 'pending',
            description: 'Cozy mountain lodge offering breathtaking views of the Himalayas. Perfect for families and couples.',
            amenities: ['Fireplace', 'Restaurant', 'Room Service', 'WiFi', 'Heating'],
            images: [
                'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=60',
            ],
            priceRange: '₹3,500 - ₹8,000',
        },
        {
            id: 3,
            name: 'City Center Business Hotel',
            location: 'Andheri, Mumbai',
            owner: 'Amit Patel',
            email: 'amit@ccbh.com',
            phone: '+91 76543 21098',
            rooms: 120,
            submittedDate: '2026-01-21',
            status: 'pending',
            description: 'Modern business hotel in the heart of Mumbai. Close to airport and business districts.',
            amenities: ['Business Center', 'Conference Rooms', 'Gym', 'Restaurant', 'WiFi', 'Airport Shuttle'],
            images: [
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60',
            ],
            priceRange: '₹4,500 - ₹12,000',
        },
        {
            id: 4,
            name: 'Heritage Palace Hotel',
            location: 'Civil Lines, Jaipur',
            owner: 'Vikram Singh',
            email: 'vikram@hph.com',
            phone: '+91 65432 10987',
            rooms: 65,
            submittedDate: '2026-01-20',
            status: 'approved',
            description: 'A royal heritage property offering authentic Rajasthani hospitality and architecture.',
            amenities: ['Pool', 'Spa', 'Restaurant', 'Cultural Shows', 'WiFi', 'Valet Parking'],
            images: [
                'https://images.unsplash.com/photo-1501117716987-c8eab037d85b?w=800&q=60',
            ],
            priceRange: '₹8,000 - ₹25,000',
        },
        {
            id: 5,
            name: 'Backwater Houseboat Stay',
            location: 'Alleppey, Kerala',
            owner: 'Thomas Kurian',
            email: 'thomas@bhs.com',
            phone: '+91 54321 09876',
            rooms: 8,
            submittedDate: '2026-01-19',
            status: 'rejected',
            description: 'Unique houseboat experience on the famous Kerala backwaters.',
            amenities: ['AC Rooms', 'Kitchen', 'Deck', 'Fishing', 'Traditional Meals'],
            images: [
                'https://images.unsplash.com/photo-1544644181-1484b3fdfc32?w=800&q=60',
            ],
            priceRange: '₹6,000 - ₹10,000',
            rejectionReason: 'Safety compliance documents missing',
        },
    ]);

    // Filter hotels based on status
    const filteredHotels = hotels.filter(hotel => {
        if (filter === 'all') return true;
        return hotel.status === filter;
    });

    // Approve hotel
    const handleApprove = (hotelId) => {
        setHotels(prev => prev.map(hotel => 
            hotel.id === hotelId ? { ...hotel, status: 'approved' } : hotel
        ));
        setSelectedHotel(null);
    };

    // Reject hotel
    const handleReject = (hotelId) => {
        const reason = prompt('Please enter rejection reason:');
        if (reason) {
            setHotels(prev => prev.map(hotel => 
                hotel.id === hotelId ? { ...hotel, status: 'rejected', rejectionReason: reason } : hotel
            ));
            setSelectedHotel(null);
        }
    };

    // Remove hotel
    const handleRemove = (hotelId) => {
        if (confirm('Are you sure you want to permanently remove this hotel?')) {
            setHotels(prev => prev.filter(hotel => hotel.id !== hotelId));
            setSelectedHotel(null);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                            <FaHotel className="text-blue-600" /> Hotel Approvals
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Review and manage hotel registration requests
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6 flex gap-2 flex-wrap">
                        {[
                            { key: 'pending', label: 'Pending', count: hotels.filter(h => h.status === 'pending').length },
                            { key: 'approved', label: 'Approved', count: hotels.filter(h => h.status === 'approved').length },
                            { key: 'rejected', label: 'Rejected', count: hotels.filter(h => h.status === 'rejected').length },
                            { key: 'all', label: 'All', count: hotels.length },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${filter === tab.key
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${filter === tab.key ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Hotels Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredHotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl"
                            >
                                {/* Hotel Image */}
                                <div className="relative h-48">
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                                        hotel.status === 'pending' ? 'bg-amber-500 text-white' :
                                        hotel.status === 'approved' ? 'bg-green-500 text-white' :
                                        'bg-red-500 text-white'
                                    }`}>
                                        {hotel.status.toUpperCase()}
                                    </div>
                                </div>

                                {/* Hotel Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{hotel.name}</h3>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <p className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-blue-500" />
                                            {hotel.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaUser className="text-blue-500" />
                                            {hotel.owner} • {hotel.email}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaBed className="text-blue-500" />
                                            {hotel.rooms} Rooms • {hotel.priceRange}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-blue-500" />
                                            Submitted: {hotel.submittedDate}
                                        </p>
                                    </div>

                                    {/* Rejection Reason */}
                                    {hotel.status === 'rejected' && hotel.rejectionReason && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                <strong>Reason:</strong> {hotel.rejectionReason}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => setSelectedHotel(hotel)}
                                            className="flex items-center gap-2 px-4 py-2 border border-yellow-400 rounded-xl font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                                        >
                                            <FaEye className="h-4 w-4" />
                                            View Details
                                        </button>
                                        
                                        {hotel.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(hotel.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                                >
                                                    <FaCheck className="h-4 w-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(hotel.id)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                                                >
                                                    <FaTimes className="h-4 w-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}

                                        {hotel.status !== 'pending' && (
                                            <button
                                                onClick={() => handleRemove(hotel.id)}
                                                className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredHotels.length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
                            <FaHotel className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Hotels Found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No hotels match the current filter.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hotel Detail Modal */}
            {selectedHotel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="relative h-56">
                            <img
                                src={selectedHotel.images[0]}
                                alt={selectedHotel.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedHotel(null)}
                                className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <FaTimes className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white">{selectedHotel.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        {selectedHotel.location}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    selectedHotel.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                    selectedHotel.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                    {selectedHotel.status.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {selectedHotel.description}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner</p>
                                    <p className="font-semibold dark:text-white">{selectedHotel.owner}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                                    <p className="font-semibold dark:text-white">{selectedHotel.phone}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Rooms</p>
                                    <p className="font-semibold dark:text-white">{selectedHotel.rooms} Rooms</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Price Range</p>
                                    <p className="font-semibold dark:text-white">{selectedHotel.priceRange}</p>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-6">
                                <h3 className="font-bold dark:text-white mb-3">Amenities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedHotel.amenities.map((amenity, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedHotel.status === 'pending' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleApprove(selectedHotel.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        <FaCheck className="h-4 w-4" />
                                        Approve Hotel
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedHotel.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                                    >
                                        <FaTimes className="h-4 w-4" />
                                        Reject Hotel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default HotelApprovals;
