package com.assetflow.backend.service;

import com.assetflow.backend.dto.ResourceBookingDto;
import java.util.List;

/**
 * Service interface for managing resource bookings.
 * Defines business logic methods for booking operations.
 */
public interface ResourceBookingService {
    ResourceBookingDto bookResource(ResourceBookingDto bookingDto);
    ResourceBookingDto cancelBooking(Long bookingId);
    List<ResourceBookingDto> getUserBookings(Long userId);
    List<ResourceBookingDto> getAssetBookings(Long assetId);
}
