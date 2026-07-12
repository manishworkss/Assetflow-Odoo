package com.assetflow.backend.dto;

import com.assetflow.backend.enums.AssetStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditRecordDto {
    private Long id;

    @NotNull(message = "Audit Cycle ID is required")
    private Long auditCycleId;

    @NotNull(message = "Asset ID is required")
    private Long assetId;
    
    private String assetName;
    private String assetTag;

    private Long verifiedById;
    private String verifiedByName;

    @NotNull(message = "Expected status is required")
    private AssetStatus expectedStatus;
    
    private AssetStatus actualStatus;
    
    private String conditionNotes;
    private LocalDateTime verifiedAt;
}
