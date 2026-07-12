package com.assetflow.backend.controller;

import com.assetflow.backend.dto.ResourceBookingDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.ResourceBookingService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@SecurityRequirement(name = "Bearer Authentication")
public class ResourceBookingController {

    @Autowired
    private ResourceBookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceBookingDto>> bookResource(@Valid @RequestBody ResourceBookingDto bookingDto) {
        ResourceBookingDto savedBooking = bookingService.bookResource(bookingDto);
        return new ResponseEntity<>(ApiResponse.success("Resource booked successfully", savedBooking), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ResourceBookingDto>> cancelBooking(@PathVariable("id") Long id) {
        ResourceBookingDto cancelledBooking = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", cancelledBooking));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ResourceBookingDto>>> getUserBookings(@PathVariable("userId") Long userId) {
        List<ResourceBookingDto> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(ApiResponse.success("User bookings retrieved successfully", bookings));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<List<ResourceBookingDto>>> getAssetBookings(@PathVariable("assetId") Long assetId) {
        List<ResourceBookingDto> bookings = bookingService.getAssetBookings(assetId);
        return ResponseEntity.ok(ApiResponse.success("Asset bookings retrieved successfully", bookings));
    }
}
