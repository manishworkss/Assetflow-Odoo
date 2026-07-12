package com.assetflow.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
/**
 * Data Transfer Object for User Signup.
 * Carries the information needed to register a new user.
 */
public class SignupDto {

    @NotEmpty(message = "Name is required")
    private String name;

    @NotEmpty(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
    
    // Note: In a real system, the role might be assigned by an Admin.
    // For simplicity, we can let them pass a role or default to EMPLOYEE.
    private String role;
}
