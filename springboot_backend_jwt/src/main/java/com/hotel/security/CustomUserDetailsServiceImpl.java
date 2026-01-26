package com.hotel.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hotel.entities.User;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Loading user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User by this email doesn't exist: " + email);
                });
        log.info("User found: ID={}, Email={}, Role={}, Password length={}", 
                user.getId(), user.getEmail(), user.getUserRole(), 
                user.getPassword() != null ? user.getPassword().length() : 0);
        // email verified
        return new UserPrincipal(user.getId(),
                user.getEmail(), user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getUserRole().name())), user.getUserRole().name());
    }

}
