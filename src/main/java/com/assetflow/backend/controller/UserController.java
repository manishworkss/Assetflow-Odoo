package com.assetflow.backend.controller;

import com.assetflow.backend.dto.RoleUpdateDto;
import com.assetflow.backend.dto.StatusUpdateDto;
import com.assetflow.backend.dto.UserDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable("id") Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable("id") Long id,
            @Valid @RequestBody RoleUpdateDto roleUpdateDto) {
        UserDto updatedUser = userService.updateUserRole(id, roleUpdateDto);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updatedUser));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody StatusUpdateDto statusUpdateDto) {
        UserDto updatedUser = userService.updateUserStatus(id, statusUpdateDto);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }
}
