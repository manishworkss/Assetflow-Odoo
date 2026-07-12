package com.assetflow.backend.scheduler;

import com.assetflow.backend.entity.Asset;
import com.assetflow.backend.repository.AssetRepository;
import com.assetflow.backend.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class AssetHealthScheduler {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void calculateAssetHealthScores() {
        List<Asset> assets = assetRepository.findAll();
        
        for (Asset asset : assets) {
            int score = 100;
            
            // Deduct points based on age (1 point per month)
            LocalDate startDate = asset.getPurchaseDate();
            if (startDate == null && asset.getCreatedAt() != null) {
                startDate = asset.getCreatedAt().toLocalDate();
            }
            
            if (startDate != null) {
                long months = ChronoUnit.MONTHS.between(startDate, LocalDate.now());
                score -= (int) months;
            }
            
            // Deduct points based on maintenance history (5 points per request)
            long maintenanceCount = maintenanceRequestRepository.countByAssetId(asset.getId());
            score -= (int) (maintenanceCount * 5);
            
            // Ensure score is between 0 and 100
            if (score < 0) score = 0;
            if (score > 100) score = 100;
            
            asset.setHealthScore(score);
        }
        
        assetRepository.saveAll(assets);
        System.out.println("Asset health scores updated for " + assets.size() + " assets.");
    }
}
