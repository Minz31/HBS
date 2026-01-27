package com.hotel.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintDTO {

    // Added friend's new field
    private Long bookingId;

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;
}