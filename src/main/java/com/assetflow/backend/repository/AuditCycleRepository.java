package com.assetflow.backend.repository;

import com.assetflow.backend.entity.AuditCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditCycleRepository extends JpaRepository<AuditCycle, Long> {
}
