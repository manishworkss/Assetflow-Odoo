package com.assetflow.backend.service;

import com.assetflow.backend.dto.AssetDto;
import java.util.List;

public interface AssetService {
    AssetDto createAsset(AssetDto assetDto);
    AssetDto getAssetById(Long id);
    List<AssetDto> getAllAssets();
    AssetDto updateAsset(Long id, AssetDto assetDto);
    void deleteAsset(Long id);
}
