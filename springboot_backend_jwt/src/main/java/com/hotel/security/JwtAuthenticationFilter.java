package com.hotel.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 1. check auth header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ") && authHeader.length() > 7) {
            // 2. extract jwt
            String jwt = authHeader.substring(7).trim();
            // 2.5. Check if token is not empty and has proper JWT format (contains at least 2 dots)
            if (jwt.isEmpty() || !jwt.contains(".")) {
                filterChain.doFilter(request, response);
                return;
            }
            // 3. validate jwt
            if (jwtUtils.validateJwtToken(jwt)) {
                // 4. get username from jwt
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                // 5. load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                // 6. create auth token
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                // 7. set auth details
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // 8. set auth in sec context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        // 9. continue filter chain
        filterChain.doFilter(request, response);

    }

}
