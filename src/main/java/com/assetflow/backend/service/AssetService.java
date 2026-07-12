package com.assetflow.backend.service;

import com.assetflow.backend.dto.AssetDto;
import java.util.List;

/**
 * Service interface for managing assets.
 * Defines business logic methods for CRUD operations on assets.
 */
public interface AssetService {
    AssetDto createAsset(AssetDto assetDto);
    AssetDto getAssetById(Long id);
    List<AssetDto> getAllAssets();
    AssetDto updateAsset(Long id, AssetDto assetDto);
    AssetDto getAssetByTag(String tag);
    void deleteAsset(Long id);
}
