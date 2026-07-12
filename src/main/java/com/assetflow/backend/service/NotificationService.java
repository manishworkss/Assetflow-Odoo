package com.assetflow.backend.service;

import com.assetflow.backend.dto.NotificationDto;

import java.util.List;

public interface NotificationService {
    void createNotification(Long userId, String title, String message);
    List<NotificationDto> getUserNotifications(Long userId);
    List<NotificationDto> getUnreadUserNotifications(Long userId);
    void markAsRead(Long notificationId);
}
