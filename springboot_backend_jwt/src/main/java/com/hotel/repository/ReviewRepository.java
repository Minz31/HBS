package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entities.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByHotelIdOrderByCreatedAtDesc(Long hotelId);
    
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.hotel.id = :hotelId")
    Double getAverageRatingByHotelId(@Param("hotelId") Long hotelId);
    
    Long countByHotelId(Long hotelId);
}