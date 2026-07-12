package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.AssetAllocationDto;
import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.AssetAllocation;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.enums.AllocationStatus;
import com.assetflow.backend.enums.AssetStatus;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.AssetAllocationRepository;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.AssetAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetAllocationServiceImpl implements AssetAllocationService {

    @Autowired
    private AssetAllocationRepository allocationRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public AssetAllocationDto allocateAsset(AssetAllocationDto allocationDto) {
        Asset asset = assetRepository.findById(allocationDto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new ConflictException("Asset is not available for allocation. Current status: " + asset.getStatus());
        }

        User user = userRepository.findById(allocationDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AssetAllocation allocation = AssetAllocation.builder()
                .asset(asset)
                .user(user)
                .allocationDate(LocalDate.now())
                .conditionOnAllocation(allocationDto.getConditionOnAllocation())
                .status(AllocationStatus.ACTIVE)
                .build();

        // Update asset status
        asset.setStatus(AssetStatus.ALLOCATED);
        assetRepository.save(asset);

        AssetAllocation savedAllocation = allocationRepository.save(allocation);
        return mapToDto(savedAllocation);
    }

    @Override
    @Transactional
    public AssetAllocationDto returnAsset(Long allocationId, String conditionOnReturn) {
        AssetAllocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found"));

        if (allocation.getStatus() == AllocationStatus.RETURNED) {
            throw new ConflictException("Asset has already been returned");
        }

        allocation.setReturnDate(LocalDate.now());
        allocation.setConditionOnReturn(conditionOnReturn);
        allocation.setStatus(AllocationStatus.RETURNED);

        Asset asset = allocation.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        AssetAllocation updatedAllocation = allocationRepository.save(allocation);
        return mapToDto(updatedAllocation);
    }

    @Override
    public List<AssetAllocationDto> getAllocationsByUser(Long userId) {
        return allocationRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AssetAllocationDto> getAllocationsByAsset(Long assetId) {
        return allocationRepository.findByAssetId(assetId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AssetAllocationDto mapToDto(AssetAllocation allocation) {
        return AssetAllocationDto.builder()
                .id(allocation.getId())
                .assetId(allocation.getAsset().getId())
                .assetName(allocation.getAsset().getName())
                .assetTag(allocation.getAsset().getAssetTag())
                .userId(allocation.getUser().getId())
                .userName(allocation.getUser().getName())
                .allocationDate(allocation.getAllocationDate())
                .returnDate(allocation.getReturnDate())
                .conditionOnAllocation(allocation.getConditionOnAllocation())
                .conditionOnReturn(allocation.getConditionOnReturn())
                .status(allocation.getStatus())
                .build();
    }
}
