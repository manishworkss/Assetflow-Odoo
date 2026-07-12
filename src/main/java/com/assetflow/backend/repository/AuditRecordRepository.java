package com.assetflow.backend.repository;

import com.assetflow.backend.entity.AuditRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRecordRepository extends JpaRepository<AuditRecord, Long> {
    List<AuditRecord> findByAuditCycleId(Long auditCycleId);
}
