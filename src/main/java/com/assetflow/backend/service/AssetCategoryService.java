package com.assetflow.backend.service;

import com.assetflow.backend.dto.AssetCategoryDto;
import java.util.List;

/**
 * Service interface for managing asset categories.
 * Defines business logic methods for category operations.
 */
public interface AssetCategoryService {
    AssetCategoryDto createCategory(AssetCategoryDto categoryDto);
    AssetCategoryDto getCategoryById(Long id);
    List<AssetCategoryDto> getAllCategories();
}
