package com.assetflow.backend.controller;

import com.assetflow.backend.dto.AssetDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.AssetService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller for managing assets.
 * Provides endpoints for performing CRUD operations on assets.
 */
public class AssetController {

    @Autowired
    private AssetService assetService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<AssetDto>> createAsset(@Valid @RequestBody AssetDto assetDto) {
        AssetDto savedAsset = assetService.createAsset(assetDto);
        return new ResponseEntity<>(ApiResponse.success("Asset created successfully", savedAsset), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto>> getAssetById(@PathVariable("id") Long id) {
        AssetDto assetDto = assetService.getAssetById(id);
        return ResponseEntity.ok(ApiResponse.success("Asset retrieved successfully", assetDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetDto>>> getAllAssets() {
        List<AssetDto> assets = assetService.getAllAssets();
        return ResponseEntity.ok(ApiResponse.success("Assets retrieved successfully", assets));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetDto>> updateAsset(@PathVariable("id") Long id,
                                                             @Valid @RequestBody AssetDto assetDto) {
        AssetDto updatedAsset = assetService.updateAsset(id, assetDto);
        return ResponseEntity.ok(ApiResponse.success("Asset updated successfully", updatedAsset));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAsset(@PathVariable("id") Long id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.success("Asset deleted successfully", null));
    }
}
