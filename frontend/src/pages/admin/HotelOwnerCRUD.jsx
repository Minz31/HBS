import { useState } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import {
    FaHotel,
    FaPlus,
    FaEdit,
    FaTrash,
    FaImage,
    FaMapMarkerAlt,
    FaSave,
    FaTimes,
    FaBed,
    FaWifi,
    FaSwimmingPool,
    FaParking,
    FaUtensils,
} from 'react-icons/fa';
import { useHotel } from '../../context/HotelContext';

const HotelOwnerCRUD = () => {
    const { selectedHotel, setSelectedHotel } = useHotel();
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [hasActiveBookings, setHasActiveBookings] = useState(false);

    // Hotels owned by this hotelier
    const [hotels, setHotels] = useState([
        {
            id: 1,
            name: 'Grand Palace Hotel',
            location: 'Mumbai, Maharashtra',
            address: '123 Marine Drive, Mumbai',
            totalRooms: 85,
            availableRooms: 42,
            priceRange: '₹5,000 - ₹25,000',
            rating: 4.5,
            status: 'active',
            activeBookings: 3,
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60',
            amenities: ['WiFi', 'Pool', 'Parking', 'Restaurant', 'Spa'],
            description: 'Luxury beachfront hotel with stunning views of the Arabian Sea.',
        },
        {
            id: 2,
            name: 'Mountain Retreat Resort',
            location: 'Shimla, Himachal Pradesh',
            address: 'Mall Road, Shimla',
            totalRooms: 45,
            availableRooms: 28,
            priceRange: '₹3,500 - ₹12,000',
            rating: 4.3,
            status: 'active',
            activeBookings: 0,
            image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=60',
            amenities: ['WiFi', 'Restaurant', 'Room Service', 'Heating'],
            description: 'Cozy mountain retreat with panoramic views of the Himalayas.',
        },
    ]);

    // Form state for add/edit
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        address: '',
        totalRooms: '',
        priceRange: '',
        description: '',
        amenities: [],
    });

    const allAmenities = [
        { id: 'wifi', name: 'WiFi', icon: FaWifi },
        { id: 'pool', name: 'Pool', icon: FaSwimmingPool },
        { id: 'parking', name: 'Parking', icon: FaParking },
        { id: 'restaurant', name: 'Restaurant', icon: FaUtensils },
        { id: 'spa', name: 'Spa', icon: FaBed },
    ];

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Toggle amenity
    const toggleAmenity = (amenityName) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenityName)
                ? prev.amenities.filter(a => a !== amenityName)
                : [...prev.amenities, amenityName]
        }));
    };

    // CREATE - Add new hotel
    const handleAddHotel = () => {
        const newHotel = {
            id: Date.now(),
            ...formData,
            totalRooms: parseInt(formData.totalRooms) || 0,
            availableRooms: parseInt(formData.totalRooms) || 0,
            rating: 0,
            status: 'pending',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60',
        };
        setHotels(prev => [...prev, newHotel]);
        setFormData({ name: '', location: '', address: '', totalRooms: '', priceRange: '', description: '', amenities: [] });
        setShowAddModal(false);
    };

    // READ - Select hotel for editing
    const handleSelectHotel = (hotel) => {
        setSelectedHotel(hotel);
        setFormData({
            name: hotel.name,
            location: hotel.location,
            address: hotel.address,
            totalRooms: hotel.totalRooms.toString(),
            priceRange: hotel.priceRange,
            description: hotel.description,
            amenities: hotel.amenities,
        });
    };

    // UPDATE - Save hotel changes
    const handleUpdateHotel = () => {
        setHotels(prev => prev.map(hotel =>
            hotel.id === selectedHotel.id
                ? {
                    ...hotel,
                    ...formData,
                    totalRooms: parseInt(formData.totalRooms) || hotel.totalRooms,
                }
                : hotel
        ));
        setIsEditing(false);
    };

    // ARCHIVE - Archive hotel (soft delete)
    const handleArchiveHotel = () => {
        setHotels(prev => prev.map(hotel =>
            hotel.id === selectedHotel.id
                ? { ...hotel, status: 'archived' }
                : hotel
        ));
        setSelectedHotel(null);
        setShowArchiveModal(false);
    };

    // DELETE - Remove hotel (only if no active bookings)
    const handleDeleteHotel = () => {
        if (selectedHotel.activeBookings > 0) {
            setHasActiveBookings(true);
            return;
        }
        setHotels(prev => prev.filter(hotel => hotel.id !== selectedHotel.id));
        setSelectedHotel(null);
        setShowDeleteModal(false);
    };

    // RESTORE - Restore archived hotel
    const handleRestoreHotel = (hotel) => {
        setHotels(prev => prev.map(h =>
            h.id === hotel.id
                ? { ...h, status: 'active' }
                : h
        ));
    };

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                                <FaHotel className="text-blue-600" /> My Hotels
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Manage your hotel properties
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            <FaPlus /> Add New Hotel
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow-lg">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{hotels.length}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Hotels</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 shadow-lg">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {hotels.reduce((acc, h) => acc + h.totalRooms, 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Rooms</p>
                        </div>
                    </div>

                    {/* Hotels Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border transition-all hover:shadow-xl ${
                                    selectedHotel?.id === hotel.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-100 dark:border-gray-700'
                                }`}
                            >
                                {/* Hotel Image */}
                                <div className="relative h-48">
                                    <img
                                        src={hotel.image}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {hotel.rating > 0 && (
                                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg text-sm font-bold flex items-center gap-1">
                                            ⭐ {hotel.rating}
                                        </div>
                                    )}
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
                                            <FaBed className="text-blue-500" />
                                            {hotel.totalRooms} Rooms ({hotel.availableRooms} available)
                                        </p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {hotel.priceRange}
                                        </p>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs">
                                                {amenity}
                                            </span>
                                        ))}
                                        {hotel.amenities.length > 4 && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                                                +{hotel.amenities.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                handleSelectHotel(hotel);
                                                setIsEditing(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-yellow-400 rounded-xl font-semibold hover:bg-yellow-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleSelectHotel(hotel);
                                                setShowDeleteModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-400 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {hotels.length === 0 && (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
                            <FaHotel className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Hotels Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Start by adding your first hotel property
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Add Your First Hotel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Hotel Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                                    <FaPlus className="text-blue-600" /> Add New Hotel
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FaTimes className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Hotel Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Hotel Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter hotel name"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    City, State *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="e.g., Mumbai, Maharashtra"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Full Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter full address"
                                />
                            </div>

                            {/* Total Rooms & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Total Rooms *
                                    </label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., 50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Price Range
                                    </label>
                                    <input
                                        type="text"
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., ₹5,000 - ₹15,000"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="Describe your hotel..."
                                />
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Amenities
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allAmenities.map((amenity) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <button
                                                key={amenity.id}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.name)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                                    formData.amenities.includes(amenity.name)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {amenity.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t dark:border-gray-700 flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddHotel}
                                disabled={!formData.name || !formData.location || !formData.totalRooms}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave /> Add Hotel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Hotel Modal */}
            {isEditing && selectedHotel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                                    <FaEdit className="text-blue-600" /> Edit Hotel
                                </h2>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FaTimes className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Same form fields as Add */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Hotel Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    City, State *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Full Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Total Rooms *
                                    </label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Price Range
                                    </label>
                                    <input
                                        type="text"
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Amenities
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {allAmenities.map((amenity) => {
                                        const Icon = amenity.icon;
                                        return (
                                            <button
                                                key={amenity.id}
                                                type="button"
                                                onClick={() => toggleAmenity(amenity.name)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                                    formData.amenities.includes(amenity.name)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {amenity.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t dark:border-gray-700 flex gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateHotel}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedHotel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Delete Hotel</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to delete <strong>{selectedHotel.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteHotel}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                            >
                                Delete Hotel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive Confirmation Modal */}
            {showArchiveModal && selectedHotel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                                <FaHotel className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Archive Hotel</h3>
                        </div>
                        
                        {selectedHotel.activeBookings > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-4">
                                <p className="text-yellow-800 dark:text-yellow-400 text-sm font-medium">
                                    ⚠️ This hotel has {selectedHotel.activeBookings} active booking(s). It will be archived but existing bookings will remain.
                                </p>
                            </div>
                        )}
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Archive <strong>{selectedHotel.name}</strong>? Archived hotels won't appear in search results but can be restored later.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowArchiveModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleArchiveHotel}
                                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                            >
                                Archive Hotel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </OwnerLayout>
    );
};

export default HotelOwnerCRUD;
