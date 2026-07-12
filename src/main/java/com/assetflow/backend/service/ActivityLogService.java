package com.assetflow.backend.service;

import com.assetflow.backend.dto.ActivityLogDto;

import java.util.List;

public interface ActivityLogService {
    void logActivity(Long userId, String action, String entityType, Long entityId, String details);
    List<ActivityLogDto> getAllActivityLogs();
}
