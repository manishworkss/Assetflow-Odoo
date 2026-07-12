package com.assetflow.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateDto {

    @NotNull(message = "Status is required")
    private Boolean active;
}
