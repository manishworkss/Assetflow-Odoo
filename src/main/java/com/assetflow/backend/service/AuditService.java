package com.assetflow.backend.service;

import com.assetflow.backend.dto.AuditCycleDto;
import com.assetflow.backend.dto.AuditRecordDto;
import java.util.List;

public interface AuditService {
    AuditCycleDto createAuditCycle(AuditCycleDto cycleDto);
    AuditCycleDto completeAuditCycle(Long cycleId);
    List<AuditCycleDto> getAllAuditCycles();
    
    AuditRecordDto logAuditRecord(Long cycleId, AuditRecordDto recordDto);
    List<AuditRecordDto> getRecordsForCycle(Long cycleId);
}
