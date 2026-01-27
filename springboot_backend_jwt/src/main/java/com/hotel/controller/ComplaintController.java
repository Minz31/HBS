package com.hotel.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.ComplaintDTO;
import com.hotel.entities.Complaint;
import com.hotel.service.ComplaintService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<Complaint> raiseComplaint(@RequestBody @jakarta.validation.Valid ComplaintDTO dto,
            Principal principal) {
        return ResponseEntity.ok(complaintService.raiseComplaint(dto, principal.getName()));
    }

    @GetMapping("/my-complaints")
    public ResponseEntity<List<Complaint>> getUserComplaints(Principal principal) {
        return ResponseEntity.ok(complaintService.getUserComplaints(principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse> resolveComplaint(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String comment) {
        return ResponseEntity.ok(complaintService.resolveComplaint(id, status, comment));
    }
}
