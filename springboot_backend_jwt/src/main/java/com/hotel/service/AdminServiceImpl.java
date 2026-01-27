package com.hotel.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.entities.Booking;
import com.hotel.entities.Hotel;
import com.hotel.entities.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // Hotel Approval Management
    @Override
    public List<Hotel> getPendingHotels() {
        return hotelRepository.findByStatus("PENDING");
    }

    @Override
    public List<Hotel> getApprovedHotels() {
        return hotelRepository.findByStatus("APPROVED");
    }

    @Override
    public List<Hotel> getRejectedHotels() {
        return hotelRepository.findByStatus("REJECTED");
    }

    @Override
    public ApiResponse approveHotel(Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        
        hotel.setStatus("APPROVED");
        hotel.setRejectionReason(null);
        hotelRepository.save(hotel);
        
        log.info("Hotel approved: {}", hotelId);
        return new ApiResponse("Success", "Hotel approved successfully");
    }

    @Override
    public ApiResponse rejectHotel(Long hotelId, String reason) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        
        hotel.setStatus("REJECTED");
        hotel.setRejectionReason(reason);
        hotelRepository.save(hotel);
        
        log.info("Hotel rejected: {} with reason: {}", hotelId, reason);
        return new ApiResponse("Success", "Hotel rejected successfully");
    }

    // Payment Management
    @Override
    public List<BookingResponseDTO> getAllPayments() {
        return bookingRepository.findAll().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getPendingPayments() {
        return bookingRepository.findByPaymentStatus("PENDING").stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getCompletedPayments() {
        return bookingRepository.findByPaymentStatus("COMPLETED").stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getFailedPayments() {
        return bookingRepository.findByPaymentStatus("FAILED").stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    // User Management
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> getSuspendedUsers() {
        return userRepository.findByAccountStatus("SUSPENDED");
    }

    @Override
    public ApiResponse suspendUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        user.setAccountStatus("SUSPENDED");
        user.setSuspensionReason(reason);
        userRepository.save(user);
        
        log.info("User suspended: {} with reason: {}", userId, reason);
        return new ApiResponse("Success", "User suspended successfully");
    }

    @Override
    public ApiResponse activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        user.setAccountStatus("ACTIVE");
        user.setSuspensionReason(null);
        userRepository.save(user);
        
        log.info("User activated: {}", userId);
        return new ApiResponse("Success", "User activated successfully");
    }

    // Helper method to map Booking to BookingResponseDTO
    private BookingResponseDTO mapToBookingResponse(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setHotelName(booking.getHotel().getName());
        dto.setHotelCity(booking.getHotel().getCity());
        dto.setRoomTypeName(booking.getRoomType().getName());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setAdults(booking.getAdults());
        dto.setChildren(booking.getChildren());
        dto.setRooms(booking.getRooms());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setBookingDate(booking.getBookingDate());
        dto.setGuestFirstName(booking.getGuestFirstName());
        dto.setGuestLastName(booking.getGuestLastName());
        dto.setGuestEmail(booking.getGuestEmail());
        dto.setGuestPhone(booking.getGuestPhone());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setTransactionId(booking.getTransactionId());
        return dto;
    }
}
