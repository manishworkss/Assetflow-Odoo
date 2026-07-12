package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.AssetDto;
import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.AssetCategory;
import com.assetflow.backend.entity.Department;
import com.assetflow.backend.enums.AssetStatus;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.AssetCategoryRepository;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.DepartmentRepository;
import com.assetflow.backend.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
/**
 * Implementation of the {@link AssetService} interface.
 * Handles the business logic for standard CRUD operations on assets.
 */
public class AssetServiceImpl implements AssetService {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public AssetDto createAsset(AssetDto assetDto) {
        if (assetRepository.findByAssetTag(assetDto.getAssetTag()).isPresent()) {
            throw new ConflictException("Asset with this tag already exists");
        }

        AssetCategory category = categoryRepository.findById(assetDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + assetDto.getCategoryId()));

        Department department = null;
        if (assetDto.getDepartmentId() != null) {
            department = departmentRepository.findById(assetDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + assetDto.getDepartmentId()));
        }

        Asset asset = Asset.builder()
                .assetTag(assetDto.getAssetTag())
                .name(assetDto.getName())
                .category(category)
                .status(assetDto.getStatus() != null ? assetDto.getStatus() : AssetStatus.AVAILABLE)
                .purchaseDate(assetDto.getPurchaseDate())
                .price(assetDto.getPrice())
                .department(department)
                .build();

        Asset savedAsset = assetRepository.save(asset);
        return mapToDto(savedAsset);
    }

    @Override
    public AssetDto getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        return mapToDto(asset);
    }

    @Override
    public List<AssetDto> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AssetDto updateAsset(Long id, AssetDto assetDto) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        if (!asset.getAssetTag().equals(assetDto.getAssetTag()) &&
                assetRepository.findByAssetTag(assetDto.getAssetTag()).isPresent()) {
            throw new ConflictException("Asset with this tag already exists");
        }

        AssetCategory category = categoryRepository.findById(assetDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + assetDto.getCategoryId()));

        Department department = null;
        if (assetDto.getDepartmentId() != null) {
            department = departmentRepository.findById(assetDto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + assetDto.getDepartmentId()));
        }

        asset.setAssetTag(assetDto.getAssetTag());
        asset.setName(assetDto.getName());
        asset.setCategory(category);
        asset.setStatus(assetDto.getStatus());
        asset.setPurchaseDate(assetDto.getPurchaseDate());
        asset.setPrice(assetDto.getPrice());
        asset.setDepartment(department);

        Asset updatedAsset = assetRepository.save(asset);
        return mapToDto(updatedAsset);
    }

    @Override
    public AssetDto getAssetByTag(String tag) {
        Asset asset = assetRepository.findByAssetTag(tag)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with tag: " + tag));
        return mapToDto(asset);
    }

    @Override
    public void deleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        assetRepository.delete(asset);
    }

    private AssetDto mapToDto(Asset asset) {
        return AssetDto.builder()
                .id(asset.getId())
                .assetTag(asset.getAssetTag())
                .name(asset.getName())
                .categoryId(asset.getCategory().getId())
                .categoryName(asset.getCategory().getName())
                .status(asset.getStatus())
                .purchaseDate(asset.getPurchaseDate())
                .price(asset.getPrice())
                .healthScore(asset.getHealthScore())
                .departmentId(asset.getDepartment() != null ? asset.getDepartment().getId() : null)
                .departmentName(asset.getDepartment() != null ? asset.getDepartment().getName() : null)
                .build();
    }
}
