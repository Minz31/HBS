package com.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotel.entities.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    List<RoomType> findByHotelId(Long hotelId);
}
