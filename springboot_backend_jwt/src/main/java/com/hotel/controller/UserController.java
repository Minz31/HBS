package com.hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dtos.AuthRequest;
import com.hotel.dtos.AuthResp;
import com.hotel.dtos.UserDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.User;
import com.hotel.security.JwtUtils;
import com.hotel.security.UserPrincipal;
import com.hotel.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175" })
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @GetMapping
    @Operation(description = "Get all users")
    public ResponseEntity<?> getAllUsers() {
        log.info("Getting all users");
        List<UserDTO> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    @Operation(description = "Get user by ID")
    public ResponseEntity<?> getUserById(@PathVariable @Min(1) @Max(100) Long userId) {
        log.info("Getting user details for ID: {}", userId);
        return ResponseEntity.ok(userService.getUserDetails(userId));
    }

    @PutMapping("/{id}")
    @Operation(description = "Update user details")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody @Valid User user) {
        log.info("Updating user with ID: {}", id);
        return ResponseEntity.ok(userService.updateDetails(id, user));
    }

    @PostMapping("/signin")
    @Operation(description = "User login")
    public ResponseEntity<?> signIn(@RequestBody @Valid AuthRequest request) {
        log.info("User sign in attempt for email: {}", request.getEmail());
        
        Authentication authToken = new UsernamePasswordAuthenticationToken(
            request.getEmail(), request.getPassword());
        
        Authentication authentication = authenticationManager.authenticate(authToken);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        
        String token = jwtUtils.generateToken(principal);
        return ResponseEntity.ok(new AuthResp(token, "Login successful"));
    }

    @PostMapping("/signup")
    @Operation(description = "User registration")
    public ResponseEntity<?> signUp(@RequestBody @Valid UserRegDTO dto) {
        log.info("User registration attempt for email: {}", dto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(userService.registerUser(dto));
    }

    @PatchMapping("/pwd-encryption")
    @Operation(description = "Encrypt all user passwords")
    public ResponseEntity<?> encryptPasswords() {
        log.info("Encrypting user passwords");
        return ResponseEntity.ok(userService.encryptPasswords());
    }
}