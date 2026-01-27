package com.hotel.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.entities.Hotel;
import com.hotel.entities.RecentlyViewed;
import com.hotel.entities.User;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RecentlyViewedRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RecentlyViewedService {

    private final RecentlyViewedRepository recentlyViewedRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;

    public void addRecentlyViewed(Long hotelId, String userEmail) {
        log.info("Adding hotel {} to recently viewed for user {}", hotelId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        
        // Check if already exists
        Optional<RecentlyViewed> existing = recentlyViewedRepository.findByUserIdAndHotelId(user.getId(), hotelId);
        
        if (existing.isPresent()) {
            // Update timestamp
            existing.get().setViewedAt(LocalDateTime.now());
            recentlyViewedRepository.save(existing.get());
        } else {
            // Create new entry
            RecentlyViewed recentlyViewed = new RecentlyViewed();
            recentlyViewed.setUser(user);
            recentlyViewed.setHotel(hotel);
            recentlyViewedRepository.save(recentlyViewed);
        }
    }

    public List<Hotel> getRecentlyViewed(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<RecentlyViewed> recentlyViewed = recentlyViewedRepository.findByUserIdOrderByViewedAtDesc(user.getId());
        
        return recentlyViewed.stream()
                .map(RecentlyViewed::getHotel)
                .limit(10) // Limit to 10 recent hotels
                .toList();
    }
}