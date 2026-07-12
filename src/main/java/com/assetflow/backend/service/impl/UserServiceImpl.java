package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.RoleUpdateDto;
import com.assetflow.backend.dto.StatusUpdateDto;
import com.assetflow.backend.dto.UserDto;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    public UserDto updateUserRole(Long id, RoleUpdateDto roleUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setRole(roleUpdateDto.getRole());
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    public UserDto updateUserStatus(Long id, StatusUpdateDto statusUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setActive(statusUpdateDto.getActive());
        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .active(user.isActive())
                .build();
    }
}
