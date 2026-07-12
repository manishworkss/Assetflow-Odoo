package com.assetflow.backend.dto;

import java.util.List;

public class DashboardStatsDto {

    private String role;
    private long totalAssets;
    private long allocatedAssets;
    private long availableAssets;
    private long inMaintenanceAssets;
    private List<AssetDto> overdueAllocations;
    private List<AssetDto> lowHealthAssets;
    private long pendingMaintenanceTickets;

    private List<MonthlyActivity> monthlyActivity;
    private List<DepartmentStat> departmentStats;
    private Kpi kpis;
    private Alert alerts;
    private List<CategoryDistribution> categoryDistribution;
    
    // We can just use Object for logs, bookings, maintenance for now 
    // or map them to their respective DTOs.
    private List<Object> recentLogs;
    private List<ResourceBookingDto> recentBookings;
    private List<MaintenanceRequestDto> recentMaintenance;

    public DashboardStatsDto() {
    }

    // Getters and Setters

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public long getTotalAssets() { return totalAssets; }
    public void setTotalAssets(long totalAssets) { this.totalAssets = totalAssets; }
    public long getAllocatedAssets() { return allocatedAssets; }
    public void setAllocatedAssets(long allocatedAssets) { this.allocatedAssets = allocatedAssets; }
    public long getAvailableAssets() { return availableAssets; }
    public void setAvailableAssets(long availableAssets) { this.availableAssets = availableAssets; }
    public long getInMaintenanceAssets() { return inMaintenanceAssets; }
    public void setInMaintenanceAssets(long inMaintenanceAssets) { this.inMaintenanceAssets = inMaintenanceAssets; }
    public List<AssetDto> getOverdueAllocations() { return overdueAllocations; }
    public void setOverdueAllocations(List<AssetDto> overdueAllocations) { this.overdueAllocations = overdueAllocations; }
    public List<AssetDto> getLowHealthAssets() { return lowHealthAssets; }
    public void setLowHealthAssets(List<AssetDto> lowHealthAssets) { this.lowHealthAssets = lowHealthAssets; }
    public long getPendingMaintenanceTickets() { return pendingMaintenanceTickets; }
    public void setPendingMaintenanceTickets(long pendingMaintenanceTickets) { this.pendingMaintenanceTickets = pendingMaintenanceTickets; }

    public List<MonthlyActivity> getMonthlyActivity() { return monthlyActivity; }
    public void setMonthlyActivity(List<MonthlyActivity> monthlyActivity) { this.monthlyActivity = monthlyActivity; }
    public List<DepartmentStat> getDepartmentStats() { return departmentStats; }
    public void setDepartmentStats(List<DepartmentStat> departmentStats) { this.departmentStats = departmentStats; }
    public Kpi getKpis() { return kpis; }
    public void setKpis(Kpi kpis) { this.kpis = kpis; }
    public Alert getAlerts() { return alerts; }
    public void setAlerts(Alert alerts) { this.alerts = alerts; }
    public List<CategoryDistribution> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(List<CategoryDistribution> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public List<Object> getRecentLogs() { return recentLogs; }
    public void setRecentLogs(List<Object> recentLogs) { this.recentLogs = recentLogs; }
    public List<ResourceBookingDto> getRecentBookings() { return recentBookings; }
    public void setRecentBookings(List<ResourceBookingDto> recentBookings) { this.recentBookings = recentBookings; }
    public List<MaintenanceRequestDto> getRecentMaintenance() { return recentMaintenance; }
    public void setRecentMaintenance(List<MaintenanceRequestDto> recentMaintenance) { this.recentMaintenance = recentMaintenance; }

    public static class MonthlyActivity {
        private String month;
        private long allocations;
        private long maintenance;
        // constructors, getters, setters
        public MonthlyActivity(String month, long allocations, long maintenance) {
            this.month = month;
            this.allocations = allocations;
            this.maintenance = maintenance;
        }
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public long getAllocations() { return allocations; }
        public void setAllocations(long allocations) { this.allocations = allocations; }
        public long getMaintenance() { return maintenance; }
        public void setMaintenance(long maintenance) { this.maintenance = maintenance; }
    }

    public static class DepartmentStat {
        private Long id;
        private String name;
        private long assetCount;
        private long valuation;
        
        public DepartmentStat(Long id, String name, long assetCount, long valuation) {
            this.id = id;
            this.name = name;
            this.assetCount = assetCount;
            this.valuation = valuation;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public long getAssetCount() { return assetCount; }
        public void setAssetCount(long assetCount) { this.assetCount = assetCount; }
        public long getValuation() { return valuation; }
        public void setValuation(long valuation) { this.valuation = valuation; }
    }

    public static class Kpi {
        private long totalAssets;
        private long allocatedAssets;
        private long availableAssets;
        private long underMaintenance;
        private long lostOrFlagged;
        private long totalValuation;
        private long activeBookings;
        private long pendingRepairs;
        private long openAudits;

        public Kpi() {}

        public long getTotalAssets() { return totalAssets; }
        public void setTotalAssets(long totalAssets) { this.totalAssets = totalAssets; }
        public long getAllocatedAssets() { return allocatedAssets; }
        public void setAllocatedAssets(long allocatedAssets) { this.allocatedAssets = allocatedAssets; }
        public long getAvailableAssets() { return availableAssets; }
        public void setAvailableAssets(long availableAssets) { this.availableAssets = availableAssets; }
        public long getUnderMaintenance() { return underMaintenance; }
        public void setUnderMaintenance(long underMaintenance) { this.underMaintenance = underMaintenance; }
        public long getLostOrFlagged() { return lostOrFlagged; }
        public void setLostOrFlagged(long lostOrFlagged) { this.lostOrFlagged = lostOrFlagged; }
        public long getTotalValuation() { return totalValuation; }
        public void setTotalValuation(long totalValuation) { this.totalValuation = totalValuation; }
        public long getActiveBookings() { return activeBookings; }
        public void setActiveBookings(long activeBookings) { this.activeBookings = activeBookings; }
        public long getPendingRepairs() { return pendingRepairs; }
        public void setPendingRepairs(long pendingRepairs) { this.pendingRepairs = pendingRepairs; }
        public long getOpenAudits() { return openAudits; }
        public void setOpenAudits(long openAudits) { this.openAudits = openAudits; }
    }

    public static class Alert {
        private long overdueCount;
        private List<AssetDto> overdueAssets;
        private long discrepancyCount;

        public Alert() {}

        public long getOverdueCount() { return overdueCount; }
        public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }
        public List<AssetDto> getOverdueAssets() { return overdueAssets; }
        public void setOverdueAssets(List<AssetDto> overdueAssets) { this.overdueAssets = overdueAssets; }
        public long getDiscrepancyCount() { return discrepancyCount; }
        public void setDiscrepancyCount(long discrepancyCount) { this.discrepancyCount = discrepancyCount; }
    }

    public static class CategoryDistribution {
        private String name;
        private long count;
        private String color;
        
        public CategoryDistribution(String name, long count, String color) {
            this.name = name;
            this.count = count;
            this.color = color;
        }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
