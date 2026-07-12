package com.assetflow.backend.dto;

import com.assetflow.backend.enums.MaintenanceStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequestDto {
    private Long id;

    @NotNull(message = "Asset ID is required")
    private Long assetId;
    
    private String assetName;
    private String assetTag;

    private Long requestedById;
    private String requestedByName;

    @NotEmpty(message = "Issue description is required")
    private String issueDescription;

    private MaintenanceStatus status;
    private String priority;
    private BigDecimal cost;
    private String resolutionNotes;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
}
