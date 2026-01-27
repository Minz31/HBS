package com.hotel.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Hotel extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String city;

    private String state;

    @Column(nullable = false)
    private String address;

    @Column(name = "star_rating")
    private Integer starRating;

    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(columnDefinition = "JSON")
    private String amenities;

    @Column(columnDefinition = "JSON")
    private String images;

    private String location;

    @Column(name = "distance_to_center")
    private String distance;

    @Column(name = "rating_text")
    private String ratingText;

    // Approval fields
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "price_range")
    private String priceRange;

    // Owner relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @ToString.Exclude
    // Using JsonIgnoreProperties allows the frontend to receive Owner data
    // without crashing on Hibernate proxy fields.
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private User owner; // Links to ROLE_HOTEL_MANAGER
}