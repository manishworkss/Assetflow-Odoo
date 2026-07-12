package com.assetflow.backend.repository;

import com.assetflow.backend.entity.ResourceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
/**
 * Repository interface for {@link ResourceBooking} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface ResourceBookingRepository extends JpaRepository<ResourceBooking, Long> {
    List<ResourceBooking> findByUserId(Long userId);
    List<ResourceBooking> findByAssetId(Long assetId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(b) FROM ResourceBooking b WHERE b.asset.id = :assetId AND b.status != com.assetflow.backend.enums.BookingStatus.CANCELLED AND b.startTime < :endTime AND b.endTime > :startTime")
    long countOverlappingBookings(@org.springframework.data.repository.query.Param("assetId") Long assetId, @org.springframework.data.repository.query.Param("startTime") java.time.LocalDateTime startTime, @org.springframework.data.repository.query.Param("endTime") java.time.LocalDateTime endTime);
}
