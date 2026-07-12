package com.assetflow.backend.dto;

import com.assetflow.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/**
 * Data Transfer Object for User.
 * Carries user data between processes, omitting sensitive information like passwords.
 */
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Long departmentId;
    private String departmentName;
}
