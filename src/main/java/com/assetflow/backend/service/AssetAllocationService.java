package com.assetflow.backend.service;

import com.assetflow.backend.dto.AssetAllocationDto;
import java.util.List;

/**
 * Service interface for managing asset allocations.
 * Defines business logic methods for allocating and returning assets.
 */
public interface AssetAllocationService {
    AssetAllocationDto allocateAsset(AssetAllocationDto allocationDto);
    AssetAllocationDto returnAsset(Long allocationId, String conditionOnReturn);
    List<AssetAllocationDto> getAllocationsByUser(Long userId);
    List<AssetAllocationDto> getAllocationsByAsset(Long assetId);
}
