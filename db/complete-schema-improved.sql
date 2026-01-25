-- ==============================================
-- HOTEL BOOKING SYSTEM - COMPLETE DATABASE SCHEMA
-- With All Frontend Requirements & Improvements
-- ==============================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS hotel_booking_db;
USE hotel_booking_db;

-- ==============================================
-- TABLE 1: USERS
-- Manages all users: Customers, Hotel Managers, Admins
-- ==============================================
CREATE TABLE users (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Authentication
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- User Information
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    avatar_url VARCHAR(500),                -- Profile picture
    
    -- Role & Status
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    status VARCHAR(20) DEFAULT 'active',    -- Account status
    
    -- Address Information
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Constraints
    CONSTRAINT users_role_chk CHECK (role IN ('customer', 'admin', 'hotel_manager')),
    CONSTRAINT users_status_chk CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 2: HOTELS
-- Stores hotel/property information
-- ==============================================
CREATE TABLE hotels (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Hotel Manager/Owner
    manager_id BIGINT,                      -- Links to hotel owner/manager
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),                   -- 'Hotel', 'Resort', 'Motel', 'Villa', etc.
    star_rating INT,                        -- 1-5 star rating
    description TEXT,
    
    -- Location Details
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    
    -- Contact Information
    contact_email VARCHAR(100),
    phone_number VARCHAR(20),
    
    -- Ratings & Reviews
    rating DECIMAL(3, 1) DEFAULT 0,         -- Average rating (e.g., 4.5)
    
    -- Status & Approval
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    
    -- Hotel Features
    total_rooms INT,
    amenities JSON,                         -- Hotel-level amenities: ["Pool", "Gym", "Spa", "Restaurant"]
    images JSON,                            -- Array of image URLs
    
    -- Policies
    cancellation_policy TEXT,
    check_in_time TIME DEFAULT '14:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT hotels_status_chk CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    CONSTRAINT hotels_star_chk CHECK (star_rating BETWEEN 1 AND 5),
    
    -- Foreign Keys
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_city (city),
    INDEX idx_status (status),
    INDEX idx_manager (manager_id),
    INDEX idx_rating (rating),
    FULLTEXT idx_name_desc (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 3: HOTEL_IMAGES
-- Stores multiple images per hotel (alternative to JSON)
-- ==============================================
CREATE TABLE hotel_images (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key
    hotel_id BIGINT NOT NULL,
    
    -- Image Details
    image_url VARCHAR(500) NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,       -- Main display image
    display_order INT DEFAULT 0,            -- Order in gallery
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_hotel_primary (hotel_id, is_primary),
    INDEX idx_hotel_order (hotel_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 4: LOCATIONS
-- Manages destinations and popular locations
-- ==============================================
CREATE TABLE locations (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Location Hierarchy
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,              -- 'country', 'state', 'city', 'destination'
    parent_id BIGINT,                       -- Self-referencing for hierarchy
    
    -- Display Settings
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,      -- Show in "Popular Destinations"
    
    -- Additional Info
    image_url VARCHAR(500),
    description TEXT,
    hotel_count INT DEFAULT 0,              -- Cached count for performance
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT locations_type_chk CHECK (type IN ('country', 'state', 'city', 'destination')),
    
    -- Foreign Keys
    FOREIGN KEY (parent_id) REFERENCES locations(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_type_featured (type, is_featured),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 5: ROOM_TYPES
-- Defines room categories with pricing
-- ==============================================
CREATE TABLE room_types (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key
    hotel_id BIGINT NOT NULL,
    
    -- Room Type Information
    name VARCHAR(100) NOT NULL,             -- 'Deluxe Suite', 'Standard Room', etc.
    description TEXT,
    
    -- Pricing
    price_per_night DECIMAL(10, 2) NOT NULL,
    
    -- Capacity
    capacity INT NOT NULL DEFAULT 2,        -- Base capacity
    max_adults INT DEFAULT 2,
    max_children INT DEFAULT 0,
    
    -- Room Features
    bed_type VARCHAR(50),                   -- 'King', 'Queen', 'Twin', '2 Singles'
    size_sqm DECIMAL(8, 2),                 -- Room size in square meters
    amenities JSON,                         -- Room-specific amenities: ["WiFi", "AC", "TV", "Mini Bar"]
    images JSON,                            -- Array of room type images
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,         -- Can be booked or not
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_hotel_active (hotel_id, is_active),
    INDEX idx_price (price_per_night)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 6: ROOM_TYPE_IMAGES
-- Stores multiple images per room type
-- ==============================================
CREATE TABLE room_type_images (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key
    room_type_id BIGINT NOT NULL,
    
    -- Image Details
    image_url VARCHAR(500) NOT NULL,
    caption TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_room_type_primary (room_type_id, is_primary),
    INDEX idx_room_type_order (room_type_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 7: ROOMS
-- Physical room instances
-- ==============================================
CREATE TABLE rooms (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    hotel_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,
    
    -- Room Details
    room_number VARCHAR(20) NOT NULL,       -- e.g., "101", "305B"
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,         -- Can be used for "soft delete"
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
    
    -- Constraints
    UNIQUE KEY unique_room (hotel_id, room_number),
    
    -- Indexes
    INDEX idx_hotel_type (hotel_id, room_type_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 8: BOOKINGS
-- Main booking/reservation records
-- ==============================================
CREATE TABLE bookings (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Booking Reference
    booking_reference VARCHAR(20) UNIQUE,   -- e.g., "BK-7890"
    
    -- Foreign Keys
    user_id BIGINT NOT NULL,                -- Customer who booked
    hotel_id BIGINT NOT NULL,
    
    -- Booking Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    
    -- Guest Information (may differ from user)
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(20),
    
    -- Guest Count
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    
    -- Pricing
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    
    -- Special Requests & Notes
    special_requests TEXT,
    
    -- Cancellation Details
    cancelled_at TIMESTAMP,
    cancelled_by BIGINT,                    -- User who cancelled
    cancellation_reason TEXT,
    
    -- Timestamps
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT bookings_dates_chk CHECK (check_out_date > check_in_date),
    CONSTRAINT bookings_status_chk CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    
    -- Indexes
    INDEX idx_user (user_id),
    INDEX idx_hotel (hotel_id),
    INDEX idx_status (status),
    INDEX idx_dates (check_in_date, check_out_date),
    INDEX idx_reference (booking_reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 9: BOOKING_ROOMS
-- Links bookings to specific physical rooms
-- (Allows multiple rooms per booking)
-- ==============================================
CREATE TABLE booking_rooms (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    booking_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    
    -- Historical Price
    price_at_booking DECIMAL(10, 2) NOT NULL,  -- Preserves price at time of booking
    
    -- Foreign Keys
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
    
    -- Indexes
    INDEX idx_booking (booking_id),
    INDEX idx_room (room_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 10: CART_ITEMS
-- Temporary storage for items before checkout
-- ==============================================
CREATE TABLE cart_items (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    room_type_id BIGINT NOT NULL,
    
    -- Booking Details
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    rooms_count INT DEFAULT 1,
    adults INT DEFAULT 2,
    children INT DEFAULT 0,
    
    -- Price Snapshot
    price_snapshot DECIMAL(10, 2),          -- Price when added to cart
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,                   -- Auto-clear old cart items
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_expires (user_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 11: FAVORITES
-- User's favorite/saved hotels (wishlists)
-- ==============================================
CREATE TABLE favorites (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    
    -- Constraints
    UNIQUE KEY unique_favorite (user_id, hotel_id),
    
    -- Indexes
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 12: RECENTLY_VIEWED
-- Tracks user's recently viewed hotels
-- ==============================================
CREATE TABLE recently_viewed (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    user_id BIGINT NOT NULL,
    hotel_id BIGINT NOT NULL,
    
    -- Timestamps
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_viewed (user_id, viewed_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 13: PAYMENTS
-- Payment transactions
-- ==============================================
CREATE TABLE payments (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Key
    booking_id BIGINT NOT NULL,
    
    -- Payment Details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',      -- ISO currency code
    payment_method VARCHAR(50) NOT NULL,    -- 'Credit Card', 'UPI', 'Net Banking', etc.
    payment_gateway VARCHAR(50),            -- 'Stripe', 'Razorpay', 'PayPal', etc.
    
    -- Transaction Details
    transaction_id VARCHAR(100),            -- External payment gateway transaction ID
    status VARCHAR(20) DEFAULT 'success',
    
    -- Refund Details
    refund_amount DECIMAL(10, 2),
    refund_date TIMESTAMP,
    refund_reason TEXT,
    
    -- Additional Data
    metadata JSON,                          -- Additional payment metadata
    
    -- Timestamps
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_booking (booking_id),
    INDEX idx_status (status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 14: REVIEWS
-- Guest reviews for hotels
-- ==============================================
CREATE TABLE reviews (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    user_id BIGINT NOT NULL,                -- Reviewer
    hotel_id BIGINT NOT NULL,
    booking_id BIGINT,                      -- Optional: Link to specific booking
    
    -- Review Content
    title VARCHAR(255),                     -- Review title/headline
    rating INT NOT NULL,                    -- Overall rating 1-5
    comment TEXT,
    
    -- Review Context
    stay_date DATE,                         -- When they stayed
    room_type VARCHAR(100),                 -- Which room type
    
    -- Moderation
    status VARCHAR(20) DEFAULT 'pending',
    
    -- Hotel Response
    response TEXT,                          -- Hotel's response to review
    response_date TIMESTAMP,
    
    -- Engagement
    helpful_count INT DEFAULT 0,            -- How many found this helpful
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT reviews_rating_chk CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT reviews_status_chk CHECK (status IN ('pending', 'published', 'flagged', 'rejected')),
    
    -- Indexes
    INDEX idx_hotel_status (hotel_id, status),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- TABLE 15: COMPLAINTS
-- Customer support tickets/complaints
-- ==============================================
CREATE TABLE complaints (
    -- Primary Key
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- Foreign Keys
    user_id BIGINT NOT NULL,
    booking_id BIGINT,                      -- Optional: Related booking
    
    -- Complaint Details
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Priority & Status
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'open',
    
    -- Resolution
    admin_response TEXT,
    resolved_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT complaints_status_chk CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    CONSTRAINT complaints_priority_chk CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Indexes
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================

-- Booking date range queries (common in hotel systems)
CREATE INDEX idx_bookings_hotel_dates ON bookings(hotel_id, check_in_date, check_out_date);

-- Room availability queries
CREATE INDEX idx_rooms_hotel_type_active ON rooms(hotel_id, room_type_id, is_active);

-- User activity tracking
CREATE INDEX idx_users_role_status ON users(role, status);

-- Hotel search optimization
CREATE INDEX idx_hotels_city_status_rating ON hotels(city, status, rating DESC);


-- ==============================================
-- TRIGGERS
-- ==============================================

-- Auto-generate booking reference
DELIMITER //
CREATE TRIGGER before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.booking_reference IS NULL THEN
        SET NEW.booking_reference = CONCAT('BK-', LPAD(NEW.id, 6, '0'));
    END IF;
END//
DELIMITER ;


-- ==============================================
-- VIEWS (Optional - For Common Queries)
-- ==============================================

-- Active Hotels View
CREATE VIEW active_hotels AS
SELECT 
    h.*,
    COUNT(DISTINCT rt.id) as room_type_count,
    COUNT(DISTINCT r.id) as total_physical_rooms,
    AVG(rt.price_per_night) as avg_price
FROM hotels h
LEFT JOIN room_types rt ON h.id = rt.hotel_id AND rt.is_active = TRUE
LEFT JOIN rooms r ON h.id = r.hotel_id AND r.is_active = TRUE
WHERE h.status = 'approved'
GROUP BY h.id;


-- Booking Summary View
CREATE VIEW booking_summary AS
SELECT 
    b.*,
    u.full_name as user_name,
    u.email as user_email,
    h.name as hotel_name,
    h.city as hotel_city,
    COUNT(br.id) as rooms_booked,
    p.status as payment_status,
    p.amount as payment_amount
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN hotels h ON b.hotel_id = h.id
LEFT JOIN booking_rooms br ON b.id = br.booking_id
LEFT JOIN payments p ON b.id = p.booking_id
GROUP BY b.id;


-- ==============================================
-- COMMENTS & DOCUMENTATION
-- ==============================================

-- Table Comments
ALTER TABLE users COMMENT = 'Stores all system users: customers, hotel managers, and admins';
ALTER TABLE hotels COMMENT = 'Hotel/property master data';
ALTER TABLE room_types COMMENT = 'Room category definitions with pricing';
ALTER TABLE rooms COMMENT = 'Physical room inventory';
ALTER TABLE bookings COMMENT = 'Customer reservations/bookings';
ALTER TABLE booking_rooms COMMENT = 'Links bookings to specific rooms';
ALTER TABLE cart_items COMMENT = 'Temporary shopping cart before checkout';
ALTER TABLE favorites COMMENT = 'User wishlists/saved hotels';
ALTER TABLE recently_viewed COMMENT = 'User browsing history';
ALTER TABLE payments COMMENT = 'Payment transactions';
ALTER TABLE reviews COMMENT = 'Guest reviews and ratings';
ALTER TABLE complaints COMMENT = 'Customer support tickets';


-- ==============================================
-- END OF SCHEMA
-- ==============================================

-- Summary Statistics
-- Total Tables: 15 core tables
-- Total Indexes: 40+ for performance
-- Total Foreign Keys: 25+ for data integrity
-- Total Constraints: 15+ for data validation
