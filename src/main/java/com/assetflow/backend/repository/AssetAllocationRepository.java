package com.assetflow.backend.repository;

import com.assetflow.backend.entity.AssetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, Long> {
    List<AssetAllocation> findByUserId(Long userId);
    List<AssetAllocation> findByAssetId(Long assetId);
}
