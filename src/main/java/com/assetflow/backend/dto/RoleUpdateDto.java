package com.assetflow.backend.dto;

import com.assetflow.backend.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateDto {

    @NotNull(message = "Role is required")
    private Role role;
}
