package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.AssetCategoryDto;
import com.assetflow.backend.entity.AssetCategory;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.AssetCategoryRepository;
import com.assetflow.backend.service.AssetCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetCategoryServiceImpl implements AssetCategoryService {

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Override
    public AssetCategoryDto createCategory(AssetCategoryDto categoryDto) {
        if (categoryRepository.findByName(categoryDto.getName()).isPresent()) {
            throw new ConflictException("Category with this name already exists");
        }

        AssetCategory category = AssetCategory.builder()
                .name(categoryDto.getName())
                .description(categoryDto.getDescription())
                .build();

        AssetCategory savedCategory = categoryRepository.save(category);
        return mapToDto(savedCategory);
    }

    @Override
    public AssetCategoryDto getCategoryById(Long id) {
        AssetCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDto(category);
    }

    @Override
    public List<AssetCategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AssetCategoryDto mapToDto(AssetCategory category) {
        return AssetCategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
