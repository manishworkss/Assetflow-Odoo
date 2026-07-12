package com.assetflow.backend.service.impl;

import com.assetflow.backend.dto.AuditCycleDto;
import com.assetflow.backend.dto.AuditRecordDto;
import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.entity.AuditCycle;
import com.assetflow.backend.entity.AuditRecord;
import com.assetflow.backend.entity.User;
import com.assetflow.backend.enums.AuditStatus;
import com.assetflow.backend.exception.ConflictException;
import com.assetflow.backend.exception.ResourceNotFoundException;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.AuditCycleRepository;
import com.assetflow.backend.repository.AuditRecordRepository;
import com.assetflow.backend.repository.UserRepository;
import com.assetflow.backend.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
/**
 * Implementation of the {@link AuditService} interface.
 * Handles the business logic for managing audit cycles and their corresponding audit records.
 */
public class AuditServiceImpl implements AuditService {

    @Autowired
    private AuditCycleRepository cycleRepository;

    @Autowired
    private AuditRecordRepository recordRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AuditCycleDto createAuditCycle(AuditCycleDto cycleDto) {
        User creator = userRepository.findById(cycleDto.getCreatedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        AuditCycle cycle = AuditCycle.builder()
                .name(cycleDto.getName())
                .startDate(cycleDto.getStartDate())
                .endDate(cycleDto.getEndDate())
                .createdBy(creator)
                .status(AuditStatus.IN_PROGRESS)
                .build();

        AuditCycle savedCycle = cycleRepository.save(cycle);
        return mapToCycleDto(savedCycle);
    }

    @Override
    public AuditCycleDto completeAuditCycle(Long cycleId) {
        AuditCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found"));

        if (cycle.getStatus() == AuditStatus.CLOSED) {
            throw new ConflictException("Audit cycle is already completed");
        }

        cycle.setStatus(AuditStatus.CLOSED);
        AuditCycle updatedCycle = cycleRepository.save(cycle);
        return mapToCycleDto(updatedCycle);
    }

    @Override
    public List<AuditCycleDto> getAllAuditCycles() {
        return cycleRepository.findAll().stream()
                .map(this::mapToCycleDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AuditRecordDto logAuditRecord(Long cycleId, AuditRecordDto recordDto) {
        AuditCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new ResourceNotFoundException("Audit cycle not found"));

        if (cycle.getStatus() == AuditStatus.CLOSED) {
            throw new ConflictException("Cannot log records for a completed audit cycle");
        }

        Asset asset = assetRepository.findById(recordDto.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User auditor = null;
        if (recordDto.getVerifiedById() != null) {
            auditor = userRepository.findById(recordDto.getVerifiedById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }

        AuditRecord record = AuditRecord.builder()
                .auditCycle(cycle)
                .asset(asset)
                .verifiedBy(auditor)
                .expectedStatus(recordDto.getExpectedStatus())
                .actualStatus(recordDto.getActualStatus())
                .conditionNotes(recordDto.getConditionNotes())
                .verifiedAt(LocalDateTime.now())
                .build();

        AuditRecord savedRecord = recordRepository.save(record);
        return mapToRecordDto(savedRecord);
    }

    @Override
    public List<AuditRecordDto> getRecordsForCycle(Long cycleId) {
        return recordRepository.findByAuditCycleId(cycleId).stream()
                .map(this::mapToRecordDto)
                .collect(Collectors.toList());
    }

    private AuditCycleDto mapToCycleDto(AuditCycle cycle) {
        return AuditCycleDto.builder()
                .id(cycle.getId())
                .name(cycle.getName())
                .startDate(cycle.getStartDate())
                .endDate(cycle.getEndDate())
                .createdById(cycle.getCreatedBy().getId())
                .createdByName(cycle.getCreatedBy().getName())
                .status(cycle.getStatus())
                .build();
    }

    private AuditRecordDto mapToRecordDto(AuditRecord record) {
        return AuditRecordDto.builder()
                .id(record.getId())
                .auditCycleId(record.getAuditCycle().getId())
                .assetId(record.getAsset().getId())
                .assetName(record.getAsset().getName())
                .assetTag(record.getAsset().getAssetTag())
                .verifiedById(record.getVerifiedBy() != null ? record.getVerifiedBy().getId() : null)
                .verifiedByName(record.getVerifiedBy() != null ? record.getVerifiedBy().getName() : null)
                .expectedStatus(record.getExpectedStatus())
                .actualStatus(record.getActualStatus())
                .conditionNotes(record.getConditionNotes())
                .verifiedAt(record.getVerifiedAt())
                .build();
    }
}
