package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByCityContainingIgnoreCase(String city);

    // Example: Find top rated hotels
    List<Hotel> findTop5ByOrderByRatingDesc();
}
