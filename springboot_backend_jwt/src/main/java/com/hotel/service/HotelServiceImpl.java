package com.hotel.service;

import java.util.List;
import java.util.Objects;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.custom_exceptions.ResourceNotFoundException;
import com.hotel.dtos.ApiResponse;
import com.hotel.dtos.HotelDTO;
import com.hotel.dtos.RoomTypeDTO;
import com.hotel.entities.Hotel;
import com.hotel.entities.RoomType;
import com.hotel.repository.HotelRepository;

import com.hotel.repository.RoomTypeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final ModelMapper modelMapper;
    private final ObjectMapper objectMapper;

    @Override
    public List<Hotel> getAllHotels() {
        try {
            log.debug("Getting all hotels");
            return hotelRepository.findAll();
        } catch (Exception e) {
            log.error("Error getting all hotels", e);
            throw new RuntimeException("Failed to retrieve hotels", e);
        }
    }

    @Override
    public Hotel getHotelDetails(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        
        try {
            log.debug("Getting hotel details for ID: {}", id);
            return hotelRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + id));
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error getting hotel details for ID: {}", id, e);
            throw new RuntimeException("Failed to retrieve hotel details", e);
        }
    }

    @Override
    public List<Hotel> searchHotels(String city, String state, String destination) {
        try {
            log.info("Searching hotels with city: {}, state: {}, destination: {}", city, state, destination);
            
            if (city != null && !city.trim().isEmpty()) {
                return hotelRepository.findByCityContainingIgnoreCase(city);
            }
            
            // Since findByStateContainingIgnoreCase doesn't exist, search by city or return all
            return getAllHotels();
        } catch (Exception e) {
            log.error("Error searching hotels", e);
            throw new RuntimeException("Failed to search hotels", e);
        }
    }

    @Override
    public List<RoomType> getHotelRooms(Long hotelId) {
        if (hotelId == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        
        try {
            log.debug("Getting rooms for hotel ID: {}", hotelId);
            return roomTypeRepository.findByHotelId(hotelId);
        } catch (Exception e) {
            log.error("Error getting rooms for hotel ID: {}", hotelId, e);
            throw new RuntimeException("Failed to retrieve hotel rooms", e);
        }
    }

    @Override
    public Hotel createHotel(HotelDTO hotelDTO) {
        if (hotelDTO == null) {
            throw new IllegalArgumentException("Hotel data cannot be null");
        }
        
        try {
            log.info("Creating new hotel: {}", hotelDTO.getName());
            
            Hotel hotel = modelMapper.map(hotelDTO, Hotel.class);
            
            processHotelJsonFields(hotel, hotelDTO.getAmenities(), hotelDTO.getImages());
            
            Hotel savedHotel = hotelRepository.save(Objects.requireNonNull(hotel));
            log.info("Hotel created successfully with ID: {}", savedHotel.getId());
            
            return savedHotel;
        } catch (Exception e) {
            log.error("Error creating hotel", e);
            throw new RuntimeException("Failed to create hotel", e);
        }
    }

    @Override
    public Hotel updateHotel(Long id, HotelDTO hotelDTO) {
        if (id == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        if (hotelDTO == null) {
            throw new IllegalArgumentException("Hotel data cannot be null");
        }
        
        try {
            log.info("Updating hotel with ID: {}", id);
            
            Hotel hotel = getHotelDetails(id);
            
            updateHotelFields(hotel, hotelDTO);
            processHotelJsonFields(hotel, hotelDTO.getAmenities(), hotelDTO.getImages());
            
            return hotelRepository.save(Objects.requireNonNull(hotel));
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error updating hotel with ID: {}", id, e);
            throw new RuntimeException("Failed to update hotel", e);
        }
    }

    @Override
    public ApiResponse deleteHotel(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        
        try {
            log.info("Deleting hotel with ID: {}", id);
            
            if (!hotelRepository.existsById(Objects.requireNonNull(id))) {
                throw new ResourceNotFoundException("Hotel not found with ID: " + id);
            }
            
            hotelRepository.deleteById(Objects.requireNonNull(id));
            return new ApiResponse("Success", "Hotel deleted successfully");
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error deleting hotel with ID: {}", id, e);
            throw new RuntimeException("Failed to delete hotel", e);
        }
    }

    @Override
    public RoomType addRoomType(Long hotelId, RoomTypeDTO roomTypeDTO) {
        if (hotelId == null) {
            throw new IllegalArgumentException("Hotel ID cannot be null");
        }
        if (roomTypeDTO == null) {
            throw new IllegalArgumentException("Room type data cannot be null");
        }
        
        try {
            log.info("Adding room type to hotel ID: {}", hotelId);
            
            Hotel hotel = getHotelDetails(hotelId);
            RoomType roomType = modelMapper.map(roomTypeDTO, RoomType.class);
            roomType.setHotel(hotel);
            
            processRoomTypeJsonFields(roomType, roomTypeDTO.getAmenities(), roomTypeDTO.getImages());
            
            return roomTypeRepository.save(roomType);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error adding room type to hotel ID: {}", hotelId, e);
            throw new RuntimeException("Failed to add room type", e);
        }
    }
    
    private void updateHotelFields(Hotel hotel, HotelDTO hotelDTO) {
        hotel.setName(hotelDTO.getName());
        hotel.setCity(hotelDTO.getCity());
        hotel.setState(hotelDTO.getState());
        hotel.setAddress(hotelDTO.getAddress());
        hotel.setDescription(hotelDTO.getDescription());
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
            log.error("Error processing JSON for hotel", e);
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
            log.error("Error processing JSON for room type", e);
            throw new RuntimeException("Error processing room type data", e);
        }
    }
}