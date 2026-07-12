package com.assetflow.backend.controller;

import com.assetflow.backend.dto.AssetAllocationDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.AssetAllocationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@SecurityRequirement(name = "Bearer Authentication")
public class AssetAllocationController {

    @Autowired
    private AssetAllocationService allocationService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @PostMapping("/allocate")
    public ResponseEntity<ApiResponse<AssetAllocationDto>> allocateAsset(@Valid @RequestBody AssetAllocationDto allocationDto) {
        AssetAllocationDto allocated = allocationService.allocateAsset(allocationDto);
        return new ResponseEntity<>(ApiResponse.success("Asset allocated successfully", allocated), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<AssetAllocationDto>> returnAsset(
            @PathVariable("id") Long id,
            @RequestParam(value = "conditionOnReturn", required = false) String conditionOnReturn) {
        AssetAllocationDto returned = allocationService.returnAsset(id, conditionOnReturn);
        return ResponseEntity.ok(ApiResponse.success("Asset returned successfully", returned));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AssetAllocationDto>>> getAllocationsByUser(@PathVariable("userId") Long userId) {
        List<AssetAllocationDto> allocations = allocationService.getAllocationsByUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User allocations retrieved successfully", allocations));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<List<AssetAllocationDto>>> getAllocationsByAsset(@PathVariable("assetId") Long assetId) {
        List<AssetAllocationDto> allocations = allocationService.getAllocationsByAsset(assetId);
        return ResponseEntity.ok(ApiResponse.success("Asset allocations retrieved successfully", allocations));
    }
}
