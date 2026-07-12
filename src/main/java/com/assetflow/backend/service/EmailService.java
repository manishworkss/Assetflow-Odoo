package com.assetflow.backend.service;

/**
 * Service for sending transactional emails and OTP verification codes.
 */
public interface EmailService {
    /**
     * Sends a 6-digit OTP verification email to the user.
     *
     * @param toEmail The recipient's email address
     * @param name The recipient's full name
     * @param otpCode The 6-digit verification code
     */
    void sendOtpVerificationEmail(String toEmail, String name, String otpCode);
}
