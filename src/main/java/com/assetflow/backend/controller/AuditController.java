package com.assetflow.backend.controller;

import com.assetflow.backend.dto.AuditCycleDto;
import com.assetflow.backend.dto.AuditRecordDto;
import com.assetflow.backend.response.ApiResponse;
import com.assetflow.backend.service.AuditService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audits")
@SecurityRequirement(name = "Bearer Authentication")
/**
 * REST controller for managing audit cycles and records.
 * Provides endpoints for creating audit cycles, logging audit records, and retrieving audit history.
 */
public class AuditController {

    @Autowired
    private AuditService auditService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('AUDITOR')")
    @PostMapping
    public ResponseEntity<ApiResponse<AuditCycleDto>> createAuditCycle(@Valid @RequestBody AuditCycleDto cycleDto) {
        AuditCycleDto savedCycle = auditService.createAuditCycle(cycleDto);
        return new ResponseEntity<>(ApiResponse.success("Audit cycle created successfully", savedCycle), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('AUDITOR')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<AuditCycleDto>> completeAuditCycle(@PathVariable("id") Long id) {
        AuditCycleDto completedCycle = auditService.completeAuditCycle(id);
        return ResponseEntity.ok(ApiResponse.success("Audit cycle completed successfully", completedCycle));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('AUDITOR') or hasRole('ASSET_MANAGER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditCycleDto>>> getAllAuditCycles() {
        List<AuditCycleDto> cycles = auditService.getAllAuditCycles();
        return ResponseEntity.ok(ApiResponse.success("Audit cycles retrieved successfully", cycles));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('AUDITOR')")
    @PostMapping("/{id}/records")
    public ResponseEntity<ApiResponse<AuditRecordDto>> logAuditRecord(
            @PathVariable("id") Long id,
            @Valid @RequestBody AuditRecordDto recordDto) {
        AuditRecordDto savedRecord = auditService.logAuditRecord(id, recordDto);
        return new ResponseEntity<>(ApiResponse.success("Audit record logged successfully", savedRecord), HttpStatus.CREATED);
    }

   
}
