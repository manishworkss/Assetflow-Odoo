package com.assetflow.backend.repository;

import com.assetflow.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
/**
 * Repository interface for {@link Department} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
}
