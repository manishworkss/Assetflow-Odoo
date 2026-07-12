package com.assetflow.backend.service.impl;

import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.AssetAllocation;
import com.assetflow.backend.entity.MaintenanceRequest;
import com.assetflow.backend.repository.AssetAllocationRepository;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.MaintenanceRequestRepository;
import com.assetflow.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final AssetRepository assetRepository;
    private final AssetAllocationRepository assetAllocationRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;

    @Override
    public List<Map<String, Object>> getAssetUtilizationTrends() {
        List<Asset> allAssets = assetRepository.findAll();
        Map<String, Long> statusCounts = allAssets.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));

        List<Map<String, Object>> report = new ArrayList<>();
        statusCounts.forEach((status, count) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("status", status);
            row.put("count", count);
            report.add(row);
        });
        return report;
    }

    @Override
    public List<Map<String, Object>> getMaintenanceFrequencyByCategory() {
        List<MaintenanceRequest> requests = maintenanceRequestRepository.findAll();
        Map<String, Long> categoryCounts = requests.stream()
                .filter(req -> req.getAsset() != null && req.getAsset().getCategory() != null)
                .collect(Collectors.groupingBy(req -> req.getAsset().getCategory().getName(), Collectors.counting()));

        List<Map<String, Object>> report = new ArrayList<>();
        categoryCounts.forEach((category, count) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("category", category);
            row.put("maintenanceCount", count);
            report.add(row);
        });
        return report;
    }

    @Override
    public List<Map<String, Object>> getDepartmentAllocationSummary() {
        List<AssetAllocation> allocations = assetAllocationRepository.findAll();
        Map<String, Long> deptCounts = allocations.stream()
                .filter(alloc -> alloc.getUser() != null && alloc.getUser().getDepartment() != null)
                .collect(Collectors.groupingBy(alloc -> alloc.getUser().getDepartment().getName(), Collectors.counting()));

        List<Map<String, Object>> report = new ArrayList<>();
        deptCounts.forEach((dept, count) -> {
            Map<String, Object> row = new HashMap<>();
            row.put("department", dept);
            row.put("allocationCount", count);
            report.add(row);
        });
        return report;
    }
}
