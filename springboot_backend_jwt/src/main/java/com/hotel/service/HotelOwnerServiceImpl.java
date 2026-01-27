package com.hotel.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.BookingResponseDTO;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Booking;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.entities.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class HotelOwnerServiceImpl implements HotelOwnerService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    @Override
    public List<Hotel> getOwnerHotels(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        return hotelRepository.findByOwnerId(owner.getId());
    }

    @Override
    public Hotel getOwnerHotelDetails(Long hotelId, String ownerEmail) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (!hotel.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not authorized to access this hotel");
        }

        return hotel;
    }

    @Override
    public Hotel createHotel(HotelDTO hotelDTO, String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);
        hotel.setOwner(owner);
        hotel.setStatus("PENDING"); // Requires admin approval

        processHotelJsonFields(hotel, hotelDTO.getAmenities(), hotelDTO.getImages());

        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel updateHotel(Long hotelId, HotelDTO hotelDTO, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);

        hotel.setName(hotelDTO.getName());
        hotel.setCity(hotelDTO.getCity());
        hotel.setState(hotelDTO.getState());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setDescription(hotelDTO.getDescription());
        hotel.setStarRating(hotelDTO.getStarRating());
        hotel.setPriceRange(hotelDTO.getPriceRange());

        processHotelJsonFields(hotel, hotelDTO.getAmenities(), hotelDTO.getImages());

        return hotelRepository.save(hotel);
    }

    @Override
    public ApiResponse deleteHotel(Long hotelId, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);
        hotelRepository.delete(hotel);
        return new ApiResponse("Success", "Hotel deleted successfully");
    }

    @Override
    public List<RoomType> getHotelRooms(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership
        return roomTypeRepository.findByHotelId(hotelId);
    }

    @Override
    public RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO, String ownerEmail) {
        Hotel hotel = getOwnerHotelDetails(hotelId, ownerEmail);

        RoomType roomType = modelMapper.map(roomTypeDTO, RoomType.class);
        roomType.setHotel(hotel);

        processRoomTypeJsonFields(roomType, roomTypeDTO.getAmenities(), roomTypeDTO.getImages());

        return roomTypeRepository.save(roomType);
    }

    @Override
    public RoomType updateRoomType(Long hotelId, Long roomTypeId, RoomTypeDTO roomTypeDTO, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));

        if (!roomType.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room type does not belong to this hotel");
        }

        roomType.setName(roomTypeDTO.getName());
        roomType.setDescription(roomTypeDTO.getDescription());
        roomType.setPricePerNight(roomTypeDTO.getPricePerNight());
        roomType.setCapacity(roomTypeDTO.getCapacity());
        if (roomTypeDTO.getTotalRooms() != null) {
            roomType.setTotalRooms(roomTypeDTO.getTotalRooms());
        }

        processRoomTypeJsonFields(roomType, roomTypeDTO.getAmenities(), roomTypeDTO.getImages());

        return roomTypeRepository.save(roomType);
    }

    @Override
    public ApiResponse deleteRoomType(Long hotelId, Long roomTypeId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found"));

        if (!roomType.getHotel().getId().equals(hotelId)) {
            throw new IllegalArgumentException("Room type does not belong to this hotel");
        }

        roomTypeRepository.delete(roomType);
        return new ApiResponse("Success", "Room type deleted successfully");
    }

    @Override
    public List<BookingResponseDTO> getOwnerBookings(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        List<Hotel> ownerHotels = hotelRepository.findByOwnerId(owner.getId());
        List<Long> hotelIds = ownerHotels.stream().map(Hotel::getId).collect(Collectors.toList());

        return bookingRepository.findAll().stream()
                .filter(b -> hotelIds.contains(b.getHotel().getId()))
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getHotelBookings(Long hotelId, String ownerEmail) {
        getOwnerHotelDetails(hotelId, ownerEmail); // Verify ownership

        return bookingRepository.findByHotelId(hotelId).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse updateBookingStatus(Long bookingId, String status, String ownerEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify owner owns this hotel
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (!booking.getHotel().getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("Not authorized to update this booking");
        }

        booking.setStatus(status);
        bookingRepository.save(booking);

        return new ApiResponse("Success", "Booking status updated successfully");
    }

    @Override
    public Map<String, Object> getOwnerDashboardStats(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        List<Hotel> ownerHotels = hotelRepository.findByOwnerId(owner.getId());
        List<Long> hotelIds = ownerHotels.stream().map(Hotel::getId).collect(Collectors.toList());

        List<Booking> allBookings = bookingRepository.findAll().stream()
                .filter(b -> hotelIds.contains(b.getHotel().getId()))
                .collect(Collectors.toList());

        long totalBookings = allBookings.size();
        long activeBookings = allBookings.stream().filter(b -> "CONFIRMED".equals(b.getStatus())).count();
        long completedBookings = allBookings.stream().filter(b -> "COMPLETED".equals(b.getStatus())).count();

        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> !"CANCELLED".equals(b.getStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalHotels", ownerHotels.size());
        stats.put("totalBookings", totalBookings);
        stats.put("activeBookings", activeBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("totalRevenue", totalRevenue);
        stats.put("pendingApprovals", ownerHotels.stream().filter(h -> "PENDING".equals(h.getStatus())).count());

        return stats;
    }

    private void processHotelJsonFields(Hotel hotel, Object amenities, Object images) {
        try {
            if (amenities != null) {
                hotel.setAmenities(objectMapper.writeValueAsString(amenities));
            }
            if (images != null) {
                hotel.setImages(objectMapper.writeValueAsString(images));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing hotel data", e);
        }
    }

    private void processRoomTypeJsonFields(RoomType roomType, Object amenities, Object images) {
        try {
            if (amenities != null) {
                roomType.setAmenities(objectMapper.writeValueAsString(amenities));
            }
            if (images != null) {
                roomType.setImages(objectMapper.writeValueAsString(images));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing room type data", e);
        }
    }

    private BookingResponseDTO mapToBookingResponse(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setHotelName(booking.getHotel().getName());
        dto.setHotelCity(booking.getHotel().getCity());
        dto.setRoomTypeName(booking.getRoomType().getName());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setAdults(booking.getAdults());
        dto.setChildren(booking.getChildren());
        dto.setRooms(booking.getRooms());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setBookingDate(booking.getBookingDate());
        dto.setGuestFirstName(booking.getGuestFirstName());
        dto.setGuestLastName(booking.getGuestLastName());
        dto.setGuestEmail(booking.getGuestEmail());
        dto.setGuestPhone(booking.getGuestPhone());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setTransactionId(booking.getTransactionId());
        return dto;
    }
}
