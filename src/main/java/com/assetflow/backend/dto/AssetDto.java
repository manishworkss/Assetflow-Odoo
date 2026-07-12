package com.assetflow.backend.dto;

import com.assetflow.backend.enums.AssetStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetDto {
    private Long id;

    @NotEmpty(message = "Asset tag is required")
    private String assetTag;

    @NotEmpty(message = "Asset name is required")
    private String name;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private String categoryName;

    private AssetStatus status;

    private LocalDate purchaseDate;

    private BigDecimal price;

    private Long departmentId;
    
    private String departmentName;
}
