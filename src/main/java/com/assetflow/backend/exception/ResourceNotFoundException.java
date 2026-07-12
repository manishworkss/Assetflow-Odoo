package com.assetflow.backend.exception;

/**
 * Exception thrown when a requested resource (e.g., Asset, User) is not found in the database.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}