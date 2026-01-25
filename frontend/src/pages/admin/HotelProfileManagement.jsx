import { useState } from 'react';
import OwnerLayout from '../../layouts/OwnerLayout';
import {
    FaBuilding,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaImage,
    FaStar,
    FaWifi,
    FaTv,
    FaFire,
    FaBolt,
    FaCheckCircle,
} from 'react-icons/fa';

const HotelProfileManagement = () => {
    const [hotelData, setHotelData] = useState({
        name: 'Grand Luxury Hotel & Spa',
        category: 'Luxury',
        rating: 5,
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        phone: '+1 (555) 123-4567',
        email: 'info@grandluxury.com',
        website: 'www.grandluxury.com',
        description: 'Experience unparalleled luxury in the heart of Manhattan...',
        checkInTime: '3:00 PM',
        checkOutTime: '11:00 AM',
    });

    const [amenities, setAmenities] = useState(
        'Free WiFi, Swimming Pool, Fitness Center, Spa & Wellness, Restaurant, Room Service, Conference Rooms'
    );

    const [images, setImages] = useState([
        { id: 1, url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=60', type: 'main' },
        { id: 2, url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=60', type: 'gallery' },
        { id: 3, url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=60', type: 'gallery' },
        { id: 4, url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=60', type: 'room' },
        { id: 5, url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=60', type: 'room' },
    ]);

    const [activeTab, setActiveTab] = useState('basic');

    const handleInputChange = (e) => {
        setHotelData({ ...hotelData, [e.target.name]: e.target.value });
    };

    const handleAmenitiesChange = (e) => {
        setAmenities(e.target.value);
    };

    // Image upload handler
    const handleImageUpload = (files) => {
        if (!files || files.length === 0) return;
        
        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max 5MB allowed.`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    id: Date.now() + Math.random(),
                    url: e.target.result,
                    type: 'gallery',
                    name: file.name
                };
                setImages(prev => [...prev, newImage]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Delete image handler
    const handleDeleteImage = (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            setImages(prev => prev.filter(img => img.id !== imageId));
        }
    };

    // Set main image handler
    const handleSetMainImage = (imageId) => {
        setImages(prev => prev.map(img => ({
            ...img,
            type: img.id === imageId ? 'main' : (img.type === 'main' ? 'gallery' : img.type)
        })));
    };

    // Change image type handler
    const handleChangeImageType = (imageId, newType) => {
        setImages(prev => prev.map(img => 
            img.id === imageId ? { ...img, type: newType } : img
        ));
    };

    const handleSave = () => {
        console.log('Saving hotel profile:', hotelData);
        console.log('Images:', images);
        alert('Hotel profile saved successfully!');
    };

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Hotel Profile Management 🏨
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your property information and settings
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {[
                            { id: 'basic', label: 'Basic Info', icon: FaBuilding },
                            { id: 'contact', label: 'Contact', icon: FaPhone },
                            { id: 'amenities', label: 'Amenities', icon: FaStar },
                            { id: 'images', label: 'Images', icon: FaImage },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-yellow-400'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                        {/* Basic Info Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Hotel Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={hotelData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={hotelData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-all"
                                        >
                                            <option>Budget</option>
                                            <option>Standard</option>
                                            <option>Premium</option>
                                            <option>Luxury</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Star Rating *
                                        </label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setHotelData({ ...hotelData, rating: star })}
                                                    className={`p-3 rounded-xl transition-all ${star <= hotelData.rating
                                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                                                        }`}
                                                >
                                                    <FaStar className="h-6 w-6" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Address *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={hotelData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={hotelData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={hotelData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Check-in Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="checkInTime"
                                            value={hotelData.checkInTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Check-out Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="checkOutTime"
                                            value={hotelData.checkOutTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={hotelData.description}
                                        onChange={handleInputChange}
                                        rows="6"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        placeholder="Tell guests about your property..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FaPhone className="h-5 w-5 inline mr-2" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={hotelData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FaEnvelope className="h-5 w-5 inline mr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={hotelData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <FaGlobe className="h-5 w-5 inline mr-2" />
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={hotelData.website}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Amenities Tab */}
                        {activeTab === 'amenities' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hotel Amenities</h2>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Describe available amenities (separate by commas)
                                    </label>
                                    <textarea
                                        value={amenities}
                                        onChange={handleAmenitiesChange}
                                        rows="8"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-indigo-500 transition-all font-medium"
                                        placeholder="e.g. Free WiFi, Swimming Pool, Spa, 24/7 Room Service..."
                                    />
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                                        * Enter your amenities as a list or a short description. These will be shown to guests during booking.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Images Tab */}
                        {activeTab === 'images' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Hotel Images</h2>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                                    </span>
                                </div>

                                {/* Upload Zone */}
                                <div 
                                    className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all cursor-pointer"
                                    onClick={() => document.getElementById('hotel-image-upload').click()}
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-yellow-500', 'bg-yellow-50'); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-yellow-500', 'bg-yellow-50'); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('border-yellow-500', 'bg-yellow-50');
                                        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                                        handleImageUpload(files);
                                    }}
                                >
                                    <input
                                        id="hotel-image-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                                        className="hidden"
                                    />
                                    <FaImage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Drop images here or click to upload
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Supports JPG, PNG, WebP • Max 5MB per image
                                    </p>
                                </div>

                                {/* Image Categories */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Main Photo Section */}
                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FaStar className="text-yellow-500" />
                                            Main Photo
                                        </h3>
                                        {images.find(img => img.type === 'main') ? (
                                            <div className="relative aspect-video rounded-xl overflow-hidden">
                                                <img 
                                                    src={images.find(img => img.type === 'main').url} 
                                                    alt="Main hotel photo"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                                    <button 
                                                        onClick={() => handleDeleteImage(images.find(img => img.type === 'main').id)}
                                                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <span className="absolute top-2 left-2 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                                    ⭐ Main Photo
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="aspect-video rounded-xl bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                                <p className="text-gray-500 dark:text-gray-400">No main photo set</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Room Photos Section */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FaBuilding className="text-blue-500" />
                                            Room Photos ({images.filter(img => img.type === 'room').length})
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {images.filter(img => img.type === 'room').slice(0, 4).map((image) => (
                                                <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden group">
                                                    <img src={image.url} alt="Room" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                        <button 
                                                            onClick={() => handleSetMainImage(image.id)}
                                                            className="p-2 bg-yellow-500 text-white rounded-lg text-xs"
                                                            title="Set as main"
                                                        >
                                                            ⭐
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteImage(image.id)}
                                                            className="p-2 bg-red-600 text-white rounded-lg text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        All Gallery Images ({images.filter(img => img.type === 'gallery').length})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {images.filter(img => img.type === 'gallery').map((image) => (
                                            <div key={image.id} className="relative aspect-video rounded-xl overflow-hidden group">
                                                <img src={image.url} alt="Gallery" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                    <button 
                                                        onClick={() => handleSetMainImage(image.id)}
                                                        className="p-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold"
                                                        title="Set as main photo"
                                                    >
                                                        ⭐ Main
                                                    </button>
                                                    <button 
                                                        onClick={() => handleChangeImageType(image.id, 'room')}
                                                        className="p-2 bg-blue-500 text-white rounded-lg text-sm font-semibold"
                                                        title="Mark as room photo"
                                                    >
                                                        🛏️ Room
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteImage(image.id)}
                                                        className="p-2 bg-red-600 text-white rounded-lg text-sm font-semibold"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {/* Add More Button */}
                                        <button 
                                            onClick={() => document.getElementById('hotel-image-upload').click()}
                                            className="aspect-video border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all"
                                        >
                                            <span className="text-3xl mb-2">➕</span>
                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Add More</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📸 Photo Tips</h4>
                                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                        <li>• Upload high-quality images (recommended: 1920x1080 or higher)</li>
                                        <li>• Include photos of rooms, lobby, amenities, and exterior</li>
                                        <li>• Set an attractive main photo - it appears in search results</li>
                                        <li>• Hotels with 10+ photos get 2x more bookings!</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-yellow-500/30 transition-all"
                            >
                                Save Changes
                            </button>
                            <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
};

export default HotelProfileManagement;
