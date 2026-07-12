package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.MaintenanceRequestDto;
import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.MaintenanceRequest;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.enums.AssetStatus;
import com.assetflow.backend.enums.MaintenanceStatus;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.MaintenanceRequestRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.MaintenanceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
/**
 * Implementation of the {@link MaintenanceRequestService} interface.
 * Handles the business logic for creating and resolving maintenance requests for assets.
 */
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public MaintenanceRequestDto createRequest(MaintenanceRequestDto requestDto) {
        Asset asset = assetRepository.findById(requestDto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User user = userRepository.findById(requestDto.getRequestedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MaintenanceRequest request = MaintenanceRequest.builder()
                .asset(asset)
                .requestedBy(user)
                .issueDescription(requestDto.getIssueDescription())
                .status(MaintenanceStatus.PENDING)
                .priority(requestDto.getPriority())
                .build();

        // Automatically move asset to MAINTENANCE status
        asset.setStatus(AssetStatus.MAINTENANCE);
        assetRepository.save(asset);

        MaintenanceRequest savedRequest = maintenanceRepository.save(request);
        return mapToDto(savedRequest);
    }

    @Override
    @Transactional
    public MaintenanceRequestDto resolveRequest(Long requestId, String resolutionNotes, BigDecimal cost) {
        MaintenanceRequest request = maintenanceRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found"));

        if (request.getStatus() == MaintenanceStatus.RESOLVED) {
            throw new ConflictException("Maintenance request is already resolved");
        }

        request.setStatus(MaintenanceStatus.RESOLVED);
        request.setResolutionNotes(resolutionNotes);
        request.setCost(cost);
        request.setResolvedAt(LocalDateTime.now());

        // Restore asset status to AVAILABLE
        Asset asset = request.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        MaintenanceRequest updatedRequest = maintenanceRepository.save(request);
        return mapToDto(updatedRequest);
    }

    @Override
    public List<MaintenanceRequestDto> getRequestsByAsset(Long assetId) {
        return maintenanceRepository.findByAssetId(assetId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceRequestDto> getAllRequests() {
        return maintenanceRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private MaintenanceRequestDto mapToDto(MaintenanceRequest request) {
        return MaintenanceRequestDto.builder()
                .id(request.getId())
                .assetId(request.getAsset().getId())
                .assetName(request.getAsset().getName())
                .assetTag(request.getAsset().getAssetTag())
                .requestedById(request.getRequestedBy().getId())
                .requestedByName(request.getRequestedBy().getName())
                .issueDescription(request.getIssueDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .cost(request.getCost())
                .resolutionNotes(request.getResolutionNotes())
                .resolvedAt(request.getResolvedAt())
                .createdAt(request.getCreatedAt())
                .build();
    }
}
