package com.hotel.dtos;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDTO {
    private String name;
    private Integer hotels;
    private Double avg;
    private String image;
    private List<String> cities;
}
