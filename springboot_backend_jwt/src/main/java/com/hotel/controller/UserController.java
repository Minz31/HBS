package com.hotel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.hotel.repository.UserRepository;
import com.hotel.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173", "http://localhost:5174",
        "http://localhost:5175" })
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        try {
            AuthResp response = userService.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResp(null, "Invalid email or password"));
        }
    }

    @PostMapping("/signup")
    @Operation(description = "User registration")
    public ResponseEntity<?> signUp(@RequestBody @Valid UserRegDTO dto) {
        log.info("User registration attempt for email: {}", dto.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.registerUser(dto));
    }

    @PatchMapping("/reset-password")
    @Operation(description = "Reset user password (Admin/Dev tool)")
    public ResponseEntity<?> resetPassword(@org.springframework.web.bind.annotation.RequestParam String email,
            @org.springframework.web.bind.annotation.RequestParam String password) {
        log.info("Resetting password for email: {}", email);
        userService.resetPassword(email, password);
        return ResponseEntity.ok("Password reset successfully");
    }

    @PatchMapping("/fix-passwords")
    @Operation(description = "Fix existing user passwords to match plain text")
    public ResponseEntity<?> fixPasswords() {
        log.info("Fixing existing user passwords");
        try {
            // Reset specific user password to match what you're trying to login with
            userService.resetPassword("rami@example.com", "1234");
            return ResponseEntity.ok("Password fixed for rami@example.com");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug-password")
    @Operation(description = "Debug password for specific user")
    public ResponseEntity<?> debugPassword(@org.springframework.web.bind.annotation.RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Test common passwords against the hash
            String[] testPasswords = {"1234", "password", "123456", "admin", "user", "test", "rami", "12345"};
            
            for (String testPwd : testPasswords) {
                boolean matches = passwordEncoder.matches(testPwd, user.getPassword());
                if (matches) {
                    return ResponseEntity.ok("Password for " + email + " is: " + testPwd);
                }
            }
            
            return ResponseEntity.ok("Password not found in common list. Hash: " + user.getPassword());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PatchMapping("/pwd-encryption")
    @Operation(description = "Encrypt all user passwords")
    public ResponseEntity<?> encryptPasswords() {
        log.info("Encrypting user passwords");
        return ResponseEntity.ok(userService.encryptPasswords());
    }

    @GetMapping("/generate-hash")
    @Operation(description = "Generate BCrypt hash for password")
    public ResponseEntity<?> generateHash(@org.springframework.web.bind.annotation.RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return ResponseEntity.ok("BCrypt hash for '" + password + "': " + hash);
    }
}