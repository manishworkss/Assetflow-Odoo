package com.assetflow.backend.exception;

/**
 * Exception thrown when a conflict occurs (e.g., trying to allocate an already allocated asset).
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}