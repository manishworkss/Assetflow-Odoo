package com.assetflow.backend.repository;

import com.assetflow.backend.entity.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
/**
 * Repository interface for {@link AssetCategory} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long> {
    Optional<AssetCategory> findByName(String name);
}
