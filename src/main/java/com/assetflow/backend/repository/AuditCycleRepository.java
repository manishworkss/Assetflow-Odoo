package com.assetflow.backend.repository;

import com.assetflow.backend.entity.AuditCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
/**
 * Repository interface for {@link AuditCycle} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface AuditCycleRepository extends JpaRepository<AuditCycle, Long> {
}
