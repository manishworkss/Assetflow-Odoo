package com.assetflow.backend.service;

import java.util.List;
import java.util.Map;

public interface ReportService {
    List<Map<String, Object>> getAssetUtilizationTrends();
    List<Map<String, Object>> getMaintenanceFrequencyByCategory();
    List<Map<String, Object>> getDepartmentAllocationSummary();
}
