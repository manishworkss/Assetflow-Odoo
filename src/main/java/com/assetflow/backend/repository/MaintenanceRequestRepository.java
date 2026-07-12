package com.assetflow.backend.repository;

import com.assetflow.backend.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
/**
 * Repository interface for {@link MaintenanceRequest} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByAssetId(Long assetId);
}
