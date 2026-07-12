package com.assetflow.backend.service;

import com.assetflow.backend.dto.MaintenanceRequestDto;
import java.util.List;

public interface MaintenanceRequestService {
    MaintenanceRequestDto createRequest(MaintenanceRequestDto requestDto);
    MaintenanceRequestDto resolveRequest(Long requestId, String resolutionNotes, java.math.BigDecimal cost);
    List<MaintenanceRequestDto> getRequestsByAsset(Long assetId);
    List<MaintenanceRequestDto> getAllRequests();
}
