package com.assetflow.backend.controller;

import com.assetflow.backend.dto.ActivityLogDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ActivityLogDto>>> getAllActivityLogs() {
        List<ActivityLogDto> logs = activityLogService.getAllActivityLogs();
        return ResponseEntity.ok(ApiResponse.success("Activity logs retrieved successfully", logs));
    }
}
