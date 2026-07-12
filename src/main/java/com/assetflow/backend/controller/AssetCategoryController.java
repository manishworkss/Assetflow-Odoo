package com.assetflow.backend.controller;

import com.assetflow.backend.dto.AssetCategoryDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.AssetCategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@SecurityRequirement(name = "Bearer Authentication")
public class AssetCategoryController {

    @Autowired
    private AssetCategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('ASSET_MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<AssetCategoryDto>> createCategory(@Valid @RequestBody AssetCategoryDto categoryDto) {
        AssetCategoryDto savedCategory = categoryService.createCategory(categoryDto);
        return new ResponseEntity<>(ApiResponse.success("Category created successfully", savedCategory), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetCategoryDto>> getCategoryById(@PathVariable("id") Long id) {
        AssetCategoryDto categoryDto = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved successfully", categoryDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetCategoryDto>>> getAllCategories() {
        List<AssetCategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }
}
