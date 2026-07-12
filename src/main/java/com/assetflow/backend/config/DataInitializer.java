package com.assetflow.backend.config;

import com.assetflow.backend.entity.Department;
import com.assetflow.backend.entity.AssetCategory;
import com.assetflow.backend.repository.DepartmentRepository;
import com.assetflow.backend.repository.AssetCategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.assetflow.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AssetCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            logger.info("Initializing core enterprise departments...");
            List<String> coreDepartments = Arrays.asList(
                "Engineering & IT",
                "Facilities & Operations",
                "Field Operations",
                "Finance & Legal",
                "Human Resources"
            );

            for (String deptName : coreDepartments) {
                if (departmentRepository.findByName(deptName).isEmpty()) {
                    Department d = new Department();
                    d.setName(deptName);
                    d.setDescription("Enterprise department for " + deptName);
                    departmentRepository.save(d);
                }
            }
            logger.info("Successfully initialized {} core departments.", departmentRepository.count());
        }

        if (categoryRepository.count() == 0) {
            logger.info("Initializing core asset categories...");
            List<String> coreCategories = Arrays.asList(
                "Laptops & Compute",
                "Heavy Machinery",
                "Fleet Vehicles",
                "Conference Rooms",
                "Networking Infrastructure"
            );

            for (String catName : coreCategories) {
                if (categoryRepository.findByName(catName).isEmpty()) {
                    AssetCategory c = new AssetCategory();
                    c.setName(catName);
                    c.setDescription("Category for " + catName);
                    categoryRepository.save(c);
                }
            }
            logger.info("Successfully initialized {} asset categories.", categoryRepository.count());
        }

        if (userRepository.findByEmail("admin@assetflow.com").isEmpty()) {
            logger.info("Initializing default system admin account...");
            com.assetflow.backend.entity.User admin = new com.assetflow.backend.entity.User();
            admin.setName("System Administrator");
            admin.setEmail("admin@assetflow.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Default password
            admin.setRole(com.assetflow.backend.enums.Role.ADMIN);
            admin.setVerified(true);
            admin.setDepartment(departmentRepository.findAll().stream().findFirst().orElse(null));
            userRepository.save(admin);
            logger.info("Default admin account created: admin@assetflow.com");
        }
    }
}
