package com.assetflow.backend.repository;

import com.assetflow.backend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
/**
 * Repository interface for {@link Asset} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetTag(String assetTag);
}
