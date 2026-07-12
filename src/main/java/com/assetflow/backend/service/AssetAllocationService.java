package com.assetflow.backend.service;

import com.assetflow.backend.dto.AssetAllocationDto;
import java.util.List;

public interface AssetAllocationService {
    AssetAllocationDto allocateAsset(AssetAllocationDto allocationDto);
    AssetAllocationDto returnAsset(Long allocationId, String conditionOnReturn);
    List<AssetAllocationDto> getAllocationsByUser(Long userId);
    List<AssetAllocationDto> getAllocationsByAsset(Long assetId);
}
