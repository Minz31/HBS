package com.hotel.dtos;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private LocalDate dob;
    private Integer regAmount = 500;
}