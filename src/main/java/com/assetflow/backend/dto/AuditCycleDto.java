package com.assetflow.backend.dto;

import com.assetflow.backend.enums.AuditStatus;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/**
 * Data Transfer Object for Audit Cycle.
 * Carries data between processes for audit cycle operations.
 */
public class AuditCycleDto {
    private Long id;

    @NotEmpty(message = "Audit name is required")
    private String name;

    private LocalDate startDate;
    private LocalDate endDate;

    private Long createdById;
    private String createdByName;

    private AuditStatus status;
}
