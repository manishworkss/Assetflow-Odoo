package com.assetflow.backend.dto;

import jakarta.validation.constraints.NotEmpty;
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
 * Data Transfer Object for Asset Category.
 * Carries data between processes for asset category operations.
 */
public class AssetCategoryDto {
    private Long id;

    @NotEmpty(message = "Category name is required")
    private String name;

    private String description;
}
