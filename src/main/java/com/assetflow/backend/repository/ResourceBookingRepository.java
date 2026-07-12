package com.assetflow.backend.repository;

import com.assetflow.backend.entity.ResourceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceBookingRepository extends JpaRepository<ResourceBooking, Long> {
    List<ResourceBooking> findByUserId(Long userId);
    List<ResourceBooking> findByAssetId(Long assetId);
}
