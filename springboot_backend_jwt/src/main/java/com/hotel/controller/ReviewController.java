package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.ReviewDTO;
import com.hotel.entities.Review;
import com.hotel.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175" })
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody @Valid ReviewDTO reviewDTO, Principal principal) {
        return ResponseEntity.ok(reviewService.createReview(reviewDTO, principal.getName()));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Review>> getHotelReviews(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reviewService.getHotelReviews(hotelId));
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<List<Review>> getUserReviews(Principal principal) {
        return ResponseEntity.ok(reviewService.getUserReviews(principal.getName()));
    }
}