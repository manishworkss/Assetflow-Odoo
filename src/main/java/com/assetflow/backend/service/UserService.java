package com.assetflow.backend.service;

import com.assetflow.backend.dto.RoleUpdateDto;
import com.assetflow.backend.dto.StatusUpdateDto;
import com.assetflow.backend.dto.UserDto;
import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto updateUserRole(Long id, RoleUpdateDto roleUpdateDto);
    UserDto updateUserStatus(Long id, StatusUpdateDto statusUpdateDto);
}
