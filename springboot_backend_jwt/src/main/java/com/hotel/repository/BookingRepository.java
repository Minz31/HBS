package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);

    List<Booking> findByHotelId(Long hotelId);

    java.util.List<Booking> findByUser(com.hotel.entities.User user);
}
