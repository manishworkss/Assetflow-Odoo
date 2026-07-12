package com.assetflow.backend.repository;

import com.assetflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
/**
 * Repository interface for {@link User} entities.
 * Provides basic CRUD operations and custom query methods.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
