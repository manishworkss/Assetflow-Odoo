package com.assetflow.backend.service;

import com.assetflow.backend.dto.AssetCategoryDto;
import java.util.List;

public interface AssetCategoryService {
    AssetCategoryDto createCategory(AssetCategoryDto categoryDto);
    AssetCategoryDto getCategoryById(Long id);
    List<AssetCategoryDto> getAllCategories();
}
