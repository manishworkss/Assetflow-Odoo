package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.ResourceBookingDto;
import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.ResourceBooking;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.enums.BookingStatus;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.ResourceBookingRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.ResourceBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
/**
 * Implementation of the {@link ResourceBookingService} interface.
 * Handles the business logic for booking resources, checking availability, and managing bookings.
 */
public class ResourceBookingServiceImpl implements ResourceBookingService {

    @Autowired
    private ResourceBookingRepository bookingRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResourceBookingDto bookResource(ResourceBookingDto bookingDto) {
        Asset asset = assetRepository.findById(bookingDto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User user = userRepository.findById(bookingDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (bookingDto.getStartTime().isAfter(bookingDto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        long overlaps = bookingRepository.countOverlappingBookings(
                asset.getId(), bookingDto.getStartTime(), bookingDto.getEndTime());
        
        if (overlaps > 0) {
            throw new ConflictException("The asset is already booked for the selected time period.");
        }

        ResourceBooking booking = ResourceBooking.builder()
                .asset(asset)
                .user(user)
                .startTime(bookingDto.getStartTime())
                .endTime(bookingDto.getEndTime())
                .purpose(bookingDto.getPurpose())
                .status(BookingStatus.APPROVED) // Auto-approve for simplicity, or PENDING if approval flow exists
                .build();

        ResourceBooking savedBooking = bookingRepository.save(booking);
        return mapToDto(savedBooking);
    }

    @Override
    public ResourceBookingDto cancelBooking(Long bookingId) {
        ResourceBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ConflictException("Booking is already cancelled");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ConflictException("Cannot cancel a booking that has already started");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        ResourceBooking updatedBooking = bookingRepository.save(booking);
        return mapToDto(updatedBooking);
    }

    @Override
    public List<ResourceBookingDto> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceBookingDto> getAssetBookings(Long assetId) {
        return bookingRepository.findByAssetId(assetId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ResourceBookingDto mapToDto(ResourceBooking booking) {
        return ResourceBookingDto.builder()
                .id(booking.getId())
                .assetId(booking.getAsset().getId())
                .assetName(booking.getAsset().getName())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .status(booking.getStatus())
                .build();
    }
}
