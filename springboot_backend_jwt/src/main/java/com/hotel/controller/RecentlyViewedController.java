package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.entities.Hotel;
import com.hotel.service.RecentlyViewedService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recently-viewed")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175" })
@RequiredArgsConstructor
public class RecentlyViewedController {

    private final RecentlyViewedService recentlyViewedService;

    @PostMapping("/hotel/{hotelId}")
    public ResponseEntity<?> addRecentlyViewed(@PathVariable Long hotelId, Principal principal) {
        recentlyViewedService.addRecentlyViewed(hotelId, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getRecentlyViewed(Principal principal) {
        return ResponseEntity.ok(recentlyViewedService.getRecentlyViewed(principal.getName()));
    }
}