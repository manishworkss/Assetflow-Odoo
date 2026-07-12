package com.assetflow.backend.controller;

import com.assetflow.backend.dto.MaintenanceRequestDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.MaintenanceRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller for handling maintenance requests.
 * Provides endpoints for creating, resolving, and retrieving maintenance requests for assets.
 */
public class MaintenanceController {

    @Autowired
    private MaintenanceRequestService maintenanceService;

    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceRequestDto>> createRequest(@Valid @RequestBody MaintenanceRequestDto requestDto) {
        MaintenanceRequestDto savedRequest = maintenanceService.createRequest(requestDto);
        return new ResponseEntity<>(ApiResponse.success("Maintenance request created successfully", savedRequest), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<MaintenanceRequestDto>> resolveRequest(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> resolutionDetails) {
        
        String notes = (String) resolutionDetails.get("resolutionNotes");
        BigDecimal cost = null;
        if (resolutionDetails.get("cost") != null) {
            cost = new BigDecimal(resolutionDetails.get("cost").toString());
        }

        MaintenanceRequestDto resolvedRequest = maintenanceService.resolveRequest(id, notes, cost);
        return ResponseEntity.ok(ApiResponse.success("Maintenance request resolved successfully", resolvedRequest));
    }

    @GetMapping("/asset/{assetId}")
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDto>>> getRequestsByAsset(@PathVariable("assetId") Long assetId) {
        List<MaintenanceRequestDto> requests = maintenanceService.getRequestsByAsset(assetId);
        return ResponseEntity.ok(ApiResponse.success("Maintenance requests for asset retrieved successfully", requests));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceRequestDto>>> getAllRequests() {
        List<MaintenanceRequestDto> requests = maintenanceService.getAllRequests();
        return ResponseEntity.ok(ApiResponse.success("All maintenance requests retrieved successfully", requests));
    }
}
