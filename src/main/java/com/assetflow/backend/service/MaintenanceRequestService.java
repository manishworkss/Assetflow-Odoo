package com.assetflow.backend.service;

import com.assetflow.backend.dto.MaintenanceRequestDto;
import java.util.List;

/**
 * Service interface for managing maintenance requests.
 * Defines business logic methods for creating and resolving requests.
 */
public interface MaintenanceRequestService {
    MaintenanceRequestDto createRequest(MaintenanceRequestDto requestDto);
    MaintenanceRequestDto resolveRequest(Long requestId, String resolutionNotes, java.math.BigDecimal cost);
    List<MaintenanceRequestDto> getRequestsByAsset(Long assetId);
    List<MaintenanceRequestDto> getAllRequests();
}
