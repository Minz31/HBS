package com.hotel.entities;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    private Double rating = 0.0; // Current average rating

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(columnDefinition = "JSON")
    private String amenities;

    @Column(columnDefinition = "JSON")
    private String images;

    // Additional fields for frontend compatibility
    private String location; // Formatted location string

    @Column(name = "distance_to_center")
    private String distance; // Distance to city center

    @Column(name = "rating_text")
    private String ratingText; // Excellent, Good, etc.

    @Column(name = "pet_friendly")
    private Boolean petFriendly = false;

    @Column(name = "meals_included")
    private String meals; // Breakfast included, All meals, etc.
}
