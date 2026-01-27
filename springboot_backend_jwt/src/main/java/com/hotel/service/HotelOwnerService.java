package com.hotel.service;

import java.util.List;
import java.util.Map;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;

public interface HotelOwnerService {
    // Hotel Management
    List<Hotel> getOwnerHotels(String ownerEmail);
    Hotel getOwnerHotelDetails(Long hotelId, String ownerEmail);
    Hotel createHotel(HotelDTO hotelDTO, String ownerEmail);
    Hotel updateHotel(Long hotelId, HotelDTO hotelDTO, String ownerEmail);
    ApiResponse deleteHotel(Long hotelId, String ownerEmail);

    // Room Management
    List<RoomType> getHotelRooms(Long hotelId, String ownerEmail);
    RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO, String ownerEmail);
    RoomType updateRoomType(Long hotelId, Long roomTypeId, RoomTypeDTO roomTypeDTO, String ownerEmail);
    ApiResponse deleteRoomType(Long hotelId, Long roomTypeId, String ownerEmail);

    // Booking Management
    List<BookingResponseDTO> getOwnerBookings(String ownerEmail);
    List<BookingResponseDTO> getHotelBookings(Long hotelId, String ownerEmail);
    ApiResponse updateBookingStatus(Long bookingId, String status, String ownerEmail);

    // Dashboard
    Map<String, Object> getOwnerDashboardStats(String ownerEmail);
}
