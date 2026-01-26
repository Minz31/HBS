package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.BookingDTO;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody @Valid BookingDTO bookingDTO,
            Principal principal) {
        return ResponseEntity.ok(bookingService.createBooking(bookingDTO, principal.getName()));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(Principal principal) {
        return ResponseEntity.ok(bookingService.getUserBookings(principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> updateBooking(@PathVariable Long id,
            @RequestBody @Valid BookingDTO bookingDTO, Principal principal) {
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDTO, principal.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, principal.getName()));
    }
}
