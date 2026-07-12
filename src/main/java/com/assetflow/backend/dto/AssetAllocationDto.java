package com.assetflow.backend.dto;

import com.assetflow.backend.enums.AllocationStatus;
import jakarta.validation.constraints.NotNull;
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
 * Data Transfer Object for Asset Allocation.
 * Carries data between processes for asset allocation operations.
 */
public class AssetAllocationDto {
    private Long id;

    @NotNull(message = "Asset ID is required")
    private Long assetId;

    private String assetName;
    private String assetTag;

    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String userName;

    private LocalDate allocationDate;
    private LocalDate returnDate;
    private String conditionOnAllocation;
    private String conditionOnReturn;
    private AllocationStatus status;
}
