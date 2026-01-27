package com.hotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entities.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByHotelId(Long hotelId);

    List<Booking> findByUser(com.hotel.entities.User user);

    List<Booking> findByPaymentStatus(String paymentStatus);
    
    // Check room availability for a specific date range
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.hotel.id = :hotelId " +
           "AND b.roomType.id = :roomTypeId " +
           "AND b.status != 'CANCELLED' " +
           "AND ((b.checkInDate <= :checkOut AND b.checkOutDate > :checkIn))")
    Long countBookingsInDateRange(@Param("hotelId") Long hotelId, 
                                  @Param("roomTypeId") Long roomTypeId,
                                  @Param("checkIn") LocalDate checkIn, 
                                  @Param("checkOut") LocalDate checkOut);
    
    // Get bookings by status
    List<Booking> findByStatus(String status);
    
    // Get bookings by date range
    @Query("SELECT b FROM Booking b WHERE b.checkInDate >= :startDate AND b.checkOutDate <= :endDate")
    List<Booking> findBookingsInDateRange(@Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
}
