package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.NotificationDto;
import com.assetflow.backend.entity.Notification;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.NotificationRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(Long userId, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .read(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> getUnreadUserNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
