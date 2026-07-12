package com.assetflow.backend.entity;

import com.assetflow.backend.enums.AssetStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_cycle_id", nullable = false)
    private AuditCycle auditCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(name = "expected_status", nullable = false)
    private AssetStatus expectedStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "actual_status")
    private AssetStatus actualStatus;

    @Column(name = "condition_notes")
    private String conditionNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
}
