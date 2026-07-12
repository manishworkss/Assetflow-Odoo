package com.assetflow.backend.constants;

/**
 * Utility class containing global constants for the application.
 * This class cannot be instantiated.
 */
public class AppConstants {
    
    /**
     * Standard message for a successful operation.
     */
    public static final String SUCCESS = "Operation completed successfully";

    /**
     * Standard message for a failed operation.
     */
    public static final String ERROR = "An error occurred";
    
    /**
     * Default prefix for asset tags.
     */
    public static final String ASSET_TAG_PREFIX = "AF-";

    // You can add more constants here...
    
    private AppConstants() {
        // Prevent instantiation
    }
}
