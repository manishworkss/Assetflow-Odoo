package com.assetflow.backend.config;

import com.assetflow.backend.entity.Department;
import com.assetflow.backend.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    }
}
