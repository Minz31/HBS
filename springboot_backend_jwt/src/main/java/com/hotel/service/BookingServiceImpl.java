package com.hotel.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingDTO;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.entities.Booking;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.entities.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final ModelMapper modelMapper;

    @Override
    public BookingResponseDTO createBooking(BookingDTO bookingDTO, String userEmail) {
        try {
            log.info("Creating booking for user: {}", userEmail);
            
            // 1. Get user
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

            // 2. Get hotel
            Hotel hotel = hotelRepository.findById(bookingDTO.getHotelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + bookingDTO.getHotelId()));

            // 3. Get room type
            RoomType roomType = roomTypeRepository.findById(bookingDTO.getRoomTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Room Type not found with ID: " + bookingDTO.getRoomTypeId()));

            // 4. Validate dates
            if (bookingDTO.getCheckInDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Check-in date cannot be in the past");
            }
            if (bookingDTO.getCheckOutDate().isBefore(bookingDTO.getCheckInDate().plusDays(1))) {
                throw new IllegalArgumentException("Check-out date must be at least one day after check-in date");
            }

            // 5. Calculate total price
            long days = ChronoUnit.DAYS.between(bookingDTO.getCheckInDate(), bookingDTO.getCheckOutDate());
            BigDecimal roomPrice = roomType.getPricePerNight().multiply(BigDecimal.valueOf(days));
            BigDecimal totalPrice = roomPrice.multiply(BigDecimal.valueOf(bookingDTO.getRooms() != null ? bookingDTO.getRooms() : 1));

            // 6. Create Booking entity
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setHotel(hotel);
            booking.setRoomType(roomType);
            booking.setCheckInDate(bookingDTO.getCheckInDate());
            booking.setCheckOutDate(bookingDTO.getCheckOutDate());
            booking.setTotalPrice(totalPrice);
            booking.setStatus("CONFIRMED");
            booking.setAdults(bookingDTO.getAdults() != null ? bookingDTO.getAdults() : 1);
            booking.setChildren(bookingDTO.getChildren() != null ? bookingDTO.getChildren() : 0);
            booking.setRooms(bookingDTO.getRooms() != null ? bookingDTO.getRooms() : 1);
            booking.setBookingReference("HB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            booking.setBookingDate(LocalDate.now());
            
            // Set payment details - default to PENDING
            booking.setPaymentStatus("PENDING");
            booking.setPaymentMethod(bookingDTO.getPaymentMethod() != null ? bookingDTO.getPaymentMethod() : "CREDIT_CARD");
            booking.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
            
            // Set guest details
            booking.setGuestFirstName(bookingDTO.getGuestFirstName() != null ? bookingDTO.getGuestFirstName() : user.getFirstName());
            booking.setGuestLastName(bookingDTO.getGuestLastName() != null ? bookingDTO.getGuestLastName() : user.getLastName());
            booking.setGuestEmail(bookingDTO.getGuestEmail() != null ? bookingDTO.getGuestEmail() : user.getEmail());
            booking.setGuestPhone(bookingDTO.getGuestPhone() != null ? bookingDTO.getGuestPhone() : user.getPhone());

            // 7. Save booking to database
            Booking savedBooking = bookingRepository.save(booking);
            log.info("Booking created successfully with ID: {} and reference: {}", savedBooking.getId(), savedBooking.getBookingReference());

            return mapToBookingResponseDTO(savedBooking);
        } catch (Exception e) {
            log.error("Error creating booking for user: {}", userEmail, e);
            throw e;
        }
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String userEmail) {
        try {
            log.info("Getting bookings for user: {}", userEmail);
            
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

            List<Booking> bookings = bookingRepository.findByUser(user);
            log.info("Found {} bookings for user: {}", bookings.size(), userEmail);
            
            return bookings.stream()
                    .map(this::mapToBookingResponseDTO)
                    .toList();
        } catch (Exception e) {
            log.error("Error getting bookings for user: {}", userEmail, e);
            throw e;
        }
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        try {
            log.info("Getting all bookings");
            
            List<Booking> bookings = bookingRepository.findAll();
            log.info("Found {} total bookings", bookings.size());
            
            return bookings.stream()
                    .map(this::mapToBookingResponseDTO)
                    .toList();
        } catch (Exception e) {
            log.error("Error getting all bookings", e);
            throw e;
        }
    }

    @Override
    public BookingResponseDTO updateBooking(Long bookingId, BookingDTO bookingDTO, String userEmail) {
        try {
            log.info("Updating booking ID: {} for user: {}", bookingId, userEmail);
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
            
            // Verify user owns this booking
            if (!booking.getUser().getEmail().equals(userEmail)) {
                throw new IllegalArgumentException("User not authorized to update this booking");
            }
            
            // Update booking details
            if (bookingDTO.getCheckInDate() != null) {
                booking.setCheckInDate(bookingDTO.getCheckInDate());
            }
            if (bookingDTO.getCheckOutDate() != null) {
                booking.setCheckOutDate(bookingDTO.getCheckOutDate());
            }
            if (bookingDTO.getAdults() != null) {
                booking.setAdults(bookingDTO.getAdults());
            }
            if (bookingDTO.getChildren() != null) {
                booking.setChildren(bookingDTO.getChildren());
            }
            if (bookingDTO.getRooms() != null) {
                booking.setRooms(bookingDTO.getRooms());
            }
            
            // Recalculate total price
            long days = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
            BigDecimal roomPrice = booking.getRoomType().getPricePerNight().multiply(BigDecimal.valueOf(days));
            BigDecimal totalPrice = roomPrice.multiply(BigDecimal.valueOf(booking.getRooms()));
            booking.setTotalPrice(totalPrice);
            
            Booking updatedBooking = bookingRepository.save(booking);
            log.info("Booking updated successfully: {}", updatedBooking.getBookingReference());
            
            return mapToBookingResponseDTO(updatedBooking);
        } catch (Exception e) {
            log.error("Error updating booking ID: {}", bookingId, e);
            throw e;
        }
    }

    @Override
    public ApiResponse cancelBooking(Long bookingId, String userEmail) {
        try {
            log.info("Cancelling booking ID: {} for user: {}", bookingId, userEmail);
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
            
            // Verify user owns this booking
            if (!booking.getUser().getEmail().equals(userEmail)) {
                throw new IllegalArgumentException("User not authorized to cancel this booking");
            }
            
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
            
            log.info("Booking cancelled successfully: {}", booking.getBookingReference());
            return new ApiResponse("Success", "Booking cancelled successfully");
        } catch (Exception e) {
            log.error("Error cancelling booking ID: {}", bookingId, e);
            throw e;
        }
    }

    private BookingResponseDTO mapToBookingResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setHotelName(booking.getHotel().getName());
        dto.setHotelCity(booking.getHotel().getCity());
        dto.setRoomTypeName(booking.getRoomType().getName());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setAdults(booking.getAdults());
        dto.setChildren(booking.getChildren());
        dto.setRooms(booking.getRooms());
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
