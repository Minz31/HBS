package com.hotel.service;

import java.util.List;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.User;

public interface AdminService {
    // Hotel Approval
    List<Hotel> getPendingHotels();
    List<Hotel> getApprovedHotels();
    List<Hotel> getRejectedHotels();
    ApiResponse approveHotel(Long hotelId);
    ApiResponse rejectHotel(Long hotelId, String reason);

    // Payment Management
    List<BookingResponseDTO> getAllPayments();
    List<BookingResponseDTO> getPendingPayments();
    List<BookingResponseDTO> getCompletedPayments();
    List<BookingResponseDTO> getFailedPayments();

    // User Management
    List<User> getAllUsers();
    List<User> getSuspendedUsers();
    ApiResponse suspendUser(Long userId, String reason);
    ApiResponse activateUser(Long userId);
}
