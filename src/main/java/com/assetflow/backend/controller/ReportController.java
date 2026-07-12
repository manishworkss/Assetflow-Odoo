package com.assetflow.backend.controller;

import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/utilization")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'ASSET_MANAGER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAssetUtilizationTrends() {
        List<Map<String, Object>> data = reportService.getAssetUtilizationTrends();
        return ResponseEntity.ok(ApiResponse.success("Asset utilization trends retrieved", data));
    }

    @GetMapping("/maintenance")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'ASSET_MANAGER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMaintenanceFrequency() {
        List<Map<String, Object>> data = reportService.getMaintenanceFrequencyByCategory();
        return ResponseEntity.ok(ApiResponse.success("Maintenance frequency retrieved", data));
    }

    @GetMapping("/department-allocations")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEPARTMENT_HEAD', 'ASSET_MANAGER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepartmentAllocationSummary() {
        List<Map<String, Object>> data = reportService.getDepartmentAllocationSummary();
        return ResponseEntity.ok(ApiResponse.success("Department allocation summary retrieved", data));
    }
}
