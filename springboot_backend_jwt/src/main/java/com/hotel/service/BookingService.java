package com.hotel.service;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingDTO;
import com.hotel.dtos.BookingResponseDTO;

public interface BookingService {
    BookingResponseDTO createBooking(BookingDTO bookingDTO, String userEmail);

    java.util.List<BookingResponseDTO> getUserBookings(String userEmail);

    java.util.List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO updateBooking(Long bookingId, BookingDTO bookingDTO, String userEmail);

    ApiResponse cancelBooking(Long bookingId, String userEmail);
}
