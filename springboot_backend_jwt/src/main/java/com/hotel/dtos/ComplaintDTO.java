package com.hotel.dtos;

import lombok.Data;

@Data
public class ComplaintDTO {
    private Long bookingId;
    private Long hotelId;
    private String subject;
    private String description;
}
