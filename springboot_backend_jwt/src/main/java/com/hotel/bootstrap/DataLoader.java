package com.hotel.bootstrap;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.entities.User;
import com.hotel.entities.UserRole;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (userRepository.count() == 0) {
                loadInitialData();
            }
        } catch (Exception e) {
            log.error("Failed to load initial data: {}", e.getMessage(), e);
            throw e;
        }
    }

    private void loadInitialData() {
        log.info("Loading initial data...");

        // Create users
        List<User> users = createUsers();
        userRepository.saveAll(users);

        // Create hotels
        List<Hotel> hotels = createHotels();
        hotelRepository.saveAll(hotels);

        // Create room types
        List<RoomType> roomTypes = createRoomTypes(hotels);
        roomTypeRepository.saveAll(roomTypes);

        log.info("Initial data loaded successfully");
    }

    private List<User> createUsers() {
        User admin = new User("Admin", "User", "admin@stays.in", 
                passwordEncoder.encode("admin123"), LocalDate.of(1990, 1, 1), 0, "1234567890");
        admin.setUserRole(UserRole.ROLE_ADMIN);

        User customer = new User("John", "Customer", "user@stays.in", 
                passwordEncoder.encode("password123"), LocalDate.of(1995, 5, 15), 0, "9876543210");
        customer.setUserRole(UserRole.ROLE_CUSTOMER);

        User hotelManager = new User("Hotel", "Manager", "owner@stays.in", 
                passwordEncoder.encode("owner123"), LocalDate.of(1985, 3, 10), 0, "5555555555");
        hotelManager.setUserRole(UserRole.ROLE_HOTEL_MANAGER);

        return Arrays.asList(admin, customer, hotelManager);
    }

    private List<Hotel> createHotels() {
        Hotel hotel1 = new Hotel();
        hotel1.setName("Taj Lands End");
        hotel1.setCity("Mumbai");
        hotel1.setState("Maharashtra");
        hotel1.setAddress("Marine Drive, Mumbai");
        hotel1.setRating(4.5);
        hotel1.setRatingCount(1250);
        hotel1.setRatingText("Excellent");
        hotel1.setDistance("5.1 km to City centre");
        hotel1.setLocation("Marine Drive, Mumbai");
        hotel1.setPetFriendly(false);
        hotel1.setMeals("Breakfast included");
        hotel1.setDescription("Luxury hotel with ocean views");

        Hotel hotel2 = new Hotel();
        hotel2.setName("The Grand Palace");
        hotel2.setCity("Jaipur");
        hotel2.setState("Rajasthan");
        hotel2.setAddress("City Palace Road, Jaipur");
        hotel2.setRating(4.8);
        hotel2.setRatingCount(987);
        hotel2.setRatingText("Exceptional");
        hotel2.setDistance("3.2 km to City centre");
        hotel2.setLocation("City Palace Road, Jaipur");
        hotel2.setPetFriendly(false);
        hotel2.setMeals("All meals included");
        hotel2.setDescription("Palace hotel with royal heritage");

        return Arrays.asList(hotel1, hotel2);
    }

    private List<RoomType> createRoomTypes(List<Hotel> hotels) {
        RoomType room1 = new RoomType();
        room1.setName("Ocean View Room");
        room1.setDescription("Spacious room with ocean view");
        room1.setPricePerNight(new BigDecimal("18500"));
        room1.setCapacity(2);
        room1.setHotel(hotels.get(0));

        RoomType room2 = new RoomType();
        room2.setName("Premier Heritage Room");
        room2.setDescription("Luxury room with royal decor");
        room2.setPricePerNight(new BigDecimal("45000"));
        room2.setCapacity(2);
        room2.setHotel(hotels.get(1));

        return Arrays.asList(room1, room2);
    }
}