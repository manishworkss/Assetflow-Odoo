package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.AssetDto;
import com.assetflow.backend.dto.DashboardStatsDto;
import com.assetflow.backend.dto.DashboardStatsDto.*;
import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.AssetAllocation;
import com.assetflow.backend.entity.Department;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.enums.AllocationStatus;
import com.assetflow.backend.enums.AssetStatus;
import com.assetflow.backend.enums.Role;
import com.assetflow.backend.repository.*;
import com.assetflow.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final AssetAllocationRepository assetAllocationRepository;
    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final ResourceBookingRepository resourceBookingRepository;
    private final AuditCycleRepository auditCycleRepository;
    private final DepartmentRepository departmentRepository;


    @Override
    public DashboardStatsDto getDashboardStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        List<Asset> allAssets = assetRepository.findAll();
        List<AssetAllocation> allAllocations = assetAllocationRepository.findAll();
        
        List<Asset> filteredAssets = filterAssets(allAssets, currentUser);
        
        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setRole(currentUser.getRole().name());
        
        long totalAssetsCount = filteredAssets.size();
        long allocatedAssetsCount = filteredAssets.stream().filter(a -> a.getStatus() == AssetStatus.ALLOCATED).count();
        long availableAssetsCount = filteredAssets.stream().filter(a -> a.getStatus() == AssetStatus.AVAILABLE).count();
        long maintenanceCount = filteredAssets.stream().filter(a -> a.getStatus() == AssetStatus.MAINTENANCE).count();
        long lostCount = filteredAssets.stream().filter(a -> a.getStatus() == AssetStatus.MISSING || a.getStatus() == AssetStatus.RETIRED).count();
        
        long totalValuation = filteredAssets.stream()
                .map(Asset::getPrice)
                .filter(p -> p != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .longValue();

        // Calculate overdue
        LocalDate today = LocalDate.now();
        List<AssetAllocation> overdueAllocations = allAllocations.stream()
                .filter(a -> a.getStatus() == AllocationStatus.ACTIVE && a.getReturnDate() != null && a.getReturnDate().isBefore(today))
                .collect(Collectors.toList());
                
        // Filter overdue assets for user
        List<AssetDto> overdueAssetDtos = overdueAllocations.stream()
                .map(AssetAllocation::getAsset)
                .filter(a -> filteredAssets.contains(a))
                .map(this::mapToAssetDto)
                .collect(Collectors.toList());

        long pendingMaintenance = maintenanceRequestRepository.count(); // simplifying for now
        long activeBookings = resourceBookingRepository.count(); // simplifying for now
        long openAudits = auditCycleRepository.count(); // simplifying for now

        dto.setTotalAssets(totalAssetsCount);
        dto.setAllocatedAssets(allocatedAssetsCount);
        dto.setAvailableAssets(availableAssetsCount);
        dto.setInMaintenanceAssets(maintenanceCount);
        dto.setOverdueAllocations(overdueAssetDtos);
        dto.setPendingMaintenanceTickets(pendingMaintenance);

        // KPIs
        Kpi kpi = new Kpi();
        kpi.setTotalAssets(totalAssetsCount);
        kpi.setAllocatedAssets(allocatedAssetsCount);
        kpi.setAvailableAssets(availableAssetsCount);
        kpi.setUnderMaintenance(maintenanceCount);
        kpi.setLostOrFlagged(lostCount);
        kpi.setTotalValuation(totalValuation);
        kpi.setActiveBookings(activeBookings);
        kpi.setPendingRepairs(pendingMaintenance);
        kpi.setOpenAudits(openAudits);
        dto.setKpis(kpi);

        // Alerts
        Alert alert = new Alert();
        alert.setOverdueCount(overdueAssetDtos.size());
        alert.setOverdueAssets(overdueAssetDtos);
        alert.setDiscrepancyCount(lostCount); // Simplified
        dto.setAlerts(alert);

        // Department Stats
        List<Department> departments = departmentRepository.findAll();
        List<DepartmentStat> deptStats = departments.stream().map(d -> {
            List<Asset> deptAssets = allAssets.stream()
                    .filter(a -> a.getDepartment() != null && a.getDepartment().getId().equals(d.getId()))
                    .collect(Collectors.toList());
            long valuation = deptAssets.stream()
                    .map(Asset::getPrice)
                    .filter(p -> p != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .longValue();
            return new DepartmentStat(d.getId(), d.getName(), deptAssets.size(), valuation);
        }).collect(Collectors.toList());
        dto.setDepartmentStats(deptStats);

        // Category Distribution (simplified)
        List<CategoryDistribution> catDist = new ArrayList<>();
        catDist.add(new CategoryDistribution("Electronics", filteredAssets.stream().filter(a -> a.getCategory().getId() == 1 || a.getCategory().getId() == 201).count(), "#714B67"));
        catDist.add(new CategoryDistribution("Furniture", filteredAssets.stream().filter(a -> a.getCategory().getId() == 2 || a.getCategory().getId() == 202).count(), "#9D6B91"));
        dto.setCategoryDistribution(catDist);

        // Monthly Activity (Dummy data for now to match mock)
        List<MonthlyActivity> monthly = new ArrayList<>();
        monthly.add(new MonthlyActivity("Jan", 14, 3));
        monthly.add(new MonthlyActivity("Feb", 22, 5));
        monthly.add(new MonthlyActivity("Mar", 18, 2));
        monthly.add(new MonthlyActivity("Apr", 29, 6));
        monthly.add(new MonthlyActivity("May", 34, 4));
        monthly.add(new MonthlyActivity("Jun", 31, 3));
        dto.setMonthlyActivity(monthly);

        dto.setRecentLogs(new ArrayList<>());
        dto.setRecentBookings(new ArrayList<>());
        dto.setRecentMaintenance(new ArrayList<>());

        return dto;
    }

    private List<Asset> filterAssets(List<Asset> assets, User user) {
        if (user.getRole() == Role.DEPARTMENT_HEAD) {
            return assets.stream()
                    .filter(a -> a.getDepartment() != null && a.getDepartment().getId().equals(user.getDepartment().getId()))
                    .collect(Collectors.toList());
        } else if (user.getRole() == Role.EMPLOYEE) {
            // In a real app, find assets currently allocated to this user.
            // For simplicity, we just return all for now to avoid complex allocation logic mapping.
            // A more accurate way: find active allocations for user, then map to assets.
            List<AssetAllocation> userAllocs = assetAllocationRepository.findAll().stream()
                    .filter(a -> a.getUser().getId().equals(user.getId()) && a.getStatus() == AllocationStatus.ACTIVE)
                    .collect(Collectors.toList());
            return userAllocs.stream().map(AssetAllocation::getAsset).collect(Collectors.toList());
        }
        return assets; // Admin sees all
    }
    
    private AssetDto mapToAssetDto(Asset asset) {
        AssetDto dto = new AssetDto();
        dto.setId(asset.getId());
        dto.setAssetTag(asset.getAssetTag());
        dto.setName(asset.getName());
        if (asset.getCategory() != null) {
            dto.setCategoryId(asset.getCategory().getId());
            dto.setCategoryName(asset.getCategory().getName());
        }
        dto.setStatus(asset.getStatus());
        dto.setPurchaseDate(asset.getPurchaseDate());
        dto.setPrice(asset.getPrice());
        if (asset.getDepartment() != null) {
            dto.setDepartmentId(asset.getDepartment().getId());
            dto.setDepartmentName(asset.getDepartment().getName());
        }
        return dto;
    }
}
