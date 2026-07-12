package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.ActivityLogDto;
import com.assetflow.backend.entity.ActivityLog;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.repository.ActivityLogRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Override
    public void logActivity(Long userId, String action, String entityType, Long entityId, String details) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        ActivityLog log = ActivityLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    @Override
    public List<ActivityLogDto> getAllActivityLogs() {
        return activityLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(log -> ActivityLogDto.builder()
                        .id(log.getId())
                        .userId(log.getUser() != null ? log.getUser().getId() : null)
                        .userName(log.getUser() != null ? log.getUser().getName() : "System")
                        .action(log.getAction())
                        .entityType(log.getEntityType())
                        .entityId(log.getEntityId())
                        .details(log.getDetails())
                        .createdAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
