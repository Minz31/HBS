package com.hotel.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.custom_exceptions.AuthenticationFailedException;
import com.hotel.custom_exceptions.InvalidInputException;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.AuthRequest;
import com.hotel.dtos.AuthResp;
import com.hotel.dtos.UserDTO;
import com.hotel.dtos.UserRegDTO;
import com.hotel.entities.User;
import com.hotel.entities.UserRole;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDTO> getAllUsers() {
        log.debug("Getting all users");
        return userRepository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, UserDTO.class))
                .toList();
    }

    @Override
    public UserDTO registerUser(UserRegDTO dto) {
        log.info("Registering new user with email: {}", dto.getEmail());
        
        if (userRepository.existsByEmailOrPhone(dto.getEmail(), dto.getPhone())) {
            throw new InvalidInputException("User already exists with this email or phone");
        }
        
        User user = modelMapper.map(dto, User.class);
        user.setUserRole(UserRole.ROLE_CUSTOMER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public String addUser(User user) {
        log.info("Adding new user: {}", user.getEmail());
        
        if (userRepository.existsByEmailOrPhone(user.getEmail(), user.getPhone())) {
            throw new InvalidInputException("User already exists with this email or phone");
        }
        
        User savedUser = userRepository.save(user);
        return "New User added with ID=" + savedUser.getId();
    }

    @Override
    public ApiResponse deleteUserDetails(Long userId) {
        log.info("Deleting user with ID: {}", userId);
        
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        
        userRepository.deleteById(userId);
        return new ApiResponse("Success", "User deleted successfully");
    }

    @Override
    public User getUserDetails(Long userId) {
        log.debug("Getting user details for ID: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    @Override
    public ApiResponse updateDetails(Long id, User user) {
        log.info("Updating user with ID: {}", id);
        
        User existingUser = getUserDetails(id);
        
        existingUser.setDob(user.getDob());
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setPassword(user.getPassword());
        existingUser.setRegAmount(user.getRegAmount());
        
        return new ApiResponse("Success", "User updated successfully");
    }

    @Override
    public AuthResp authenticate(AuthRequest request) {
        log.info("Authenticating user: {}", request.getEmail());
        
        User user = userRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new AuthenticationFailedException("Invalid email or password"));
        
        AuthResp response = modelMapper.map(user, AuthResp.class);
        response.setMessage("Login successful");
        
        return response;
    }

    @Override
    public ApiResponse encryptPasswords() {
        log.info("Encrypting all user passwords");
        
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(passwordEncoder.encode(user.getPassword())));
        
        return new ApiResponse("Success", "All passwords encrypted successfully");
    }
}